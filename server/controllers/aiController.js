import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from '@clerk/express';
import cloudinary from "../configs/cloudinary.js";
import axios from "axios";
import FormData from "form-data";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'


const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Controller to generate article
export const genreateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    // ✅ Input validation
    if (!prompt || !length) {
      return res.status(400).json({ success: false, message: "Prompt and length are required." });
    }

    // ✅ Token length mapping
    const tokenLengthMap = {
      short: 300,
      long: 700,
      medium: 500, // optional: handle medium too
    };
    const max_tokens = tokenLengthMap[length] || 300;

    // ✅ Check usage limit for free users
    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ success: false, message: "Limit reached! Upgrade to premium to continue!" });
    }

    // ✅ Generate AI content
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens,
    });

    const content = response.choices?.[0]?.message?.content || "No content generated.";

    // ✅ Save generation in DB
    await sql`
      INSERT INTO creation (user_id, prompt, content, type) 
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    // ✅ Update usage for free users
    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    // ✅ Return response
    res.json({ success: true, content });

  } catch (error) {
    console.error("Article generation failed:", error);
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};



//Controller to generate Blog title
export const genreateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({ success: false, message: "Limit reached! Upgrade to continue!" });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{role: "user",content: prompt, }],
          
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices?.[0]?.message?.content || "No content generated.";

    await sql`
      INSERT INTO creation (user_id, prompt, content, type) 
      VALUES (${userId}, ${prompt}, ${content}, 'blog-titles')
    `;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, content });

  } catch (error) { 
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Controller to generate Image
export const genreateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish} = req.body;
    const plan = req.plan;
   

    if (plan !== 'premium' ) {
      return res.json({ success: false, message: "Only for Premium Users!" });
    }

    const form = new FormData();
    form.append('prompt', prompt);
    const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", form, {
        headers: {
            ...form.getHeaders(),
            'x-api-key': process.env.CLIPDROP_API_KEY
        },
        responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;
    
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    
    await sql`
      INSERT INTO creation (user_id, prompt, content, type, publish) 
      VALUES (${userId}, ${prompt}, ${secure_url}, 'genreat-image', ${publish ?? false})
    `;


    res.json({ success: true, content: secure_url });

  } catch (error) {
  console.error("Data:", error.response?.data);
  res.json({
    success: false,
    message: error.response?.data?.message || "Unknown ClipDrop error"
  });
  }
}

 //Controller to remove background
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();  // Needs Bearer token in frontend
    const image = req.file;
    const plan = req.plan;

    if (!image) {
      return res.status(400).json({ success: false, message: "No image uploaded." });
    }

    if (plan !== 'premium') {
      return res.json({ success: false, message: "Only for Premium Users!" });
    }

       const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation:[
        {
          effect: 'background_removal',
          background_removal: 'remove_the_backgound'
        }
      ]
    });

    await sql`
      INSERT INTO creation (user_id, prompt, content, type) 
      VALUES (${userId}, 'remove_background_from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.error("Cloudinary error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || "Background removal failed",
    });
  }
};


// remove the object
export const removeObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({ success: false, message: "Only for Premium Users!" });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageurl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: 'image'
    });

    await sql`
      INSERT INTO creation (user_id, prompt, content, type) 
      VALUES (${userId}, ${`remove ${object} from image`}, ${imageurl}, 'image')
    `;

    res.json({ success: true, content: imageurl });

  } catch (error) {
    console.error("Data:", error.response?.data);
    res.json({
      success: false,
      message: error.response?.data?.message 
    });
  }
}


// for resume ...
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume  = req.file;
    const plan = req.plan;
   

    if (plan !== 'premium' ) {
      return res.json({ success: false, message: "Only for Premium Users!" });
    }
    
    if(resume.size > 5* 1024 *1024){
      res.json({success: false, message: "Resume files size exceeds! allowed size (5MB"})
    }
    const dataBuffer = fs.readFileSync(resume.path)
    const pdfData = await pdf(dataBuffer)

    const prompt = `Review the following resume and provide constructive feedback on it's strength, weeknesses, and areas for improvement.
        Resume content:/n/n${pdfData.text}`
        
       // Getting the response form gemini api
       const response =  await AI.chat.completions.create({
        model:"gemini-2.0-flash",
        messages:[{role: "user", content: prompt}],
        temperature: 0.7,
        max_tokens:1000,
       }) ;
       const content = response.choices[0].message.content

    await sql`
      INSERT INTO creation (user_id, prompt, content, type) 
      VALUES (${userId}, 'Review the uploaded resume' , ${content}, 'resume-review')
    `;

    res.json({ success: true, content });

  } catch (error) {
  console.error("Data:", error.response?.data);
  res.json({
    success: false,
    message: error.response?.data?.message 
  });
  }
}
