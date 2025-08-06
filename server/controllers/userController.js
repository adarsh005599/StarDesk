import sql from '../configs/db.js'

export const getUserCreations = async (req, res) =>{
    try {
        const {userId} = req.auth();
        const creation = await sql `SELECT * FROM creation WHERE user_id = ${userId} ORDER BY created_at DESC`

        res.json({success: true, creation})
        
    } catch (error) {
        res.json({success: true, message: error.message})
    }
}
export const getPublishedCreation = async (req, res) =>{
    try {
        const creation = await sql `SELECT * FROM creation WHERE publish = true ORDER BY created_at DESC`
        console.log("Fetched creations:", creation);

        res.json({success: true, creation})
        
    } catch (error) {
       
    res.status(500).json({ success: false, message: error.message });
}

    }

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ get Clerk userId
    const { id } = req.body;       // ✅ creation id

    const [creation] = await sql`SELECT * FROM creation WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found!" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    const formattedArray = `{${updatedLikes.join(',')}}`; // for PostgreSQL array format

    await sql`
      UPDATE creation
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message }); // ❗ Fix success=false on error
  }
};
