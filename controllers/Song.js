const mongoose = require("mongoose");
const SongSchema = require('../models/Song'); // Import your SongSchema
const { Ministry } = require('../models/MinistrySongs');
const Song = mongoose.model('Song', SongSchema);




const createSongs = async (req, res) => {

    try {
        const { ministryId } = req.params;
        const { title, lyrics, intro, link, lyricslink } = req.body

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Create a new song
        const newSong = new Song({ title, lyrics, intro, link, lyricslink });

        // Add the song to the ministry's songs array
        ministry.songs.push(newSong);

        // Save the ministry with the new song
        await ministry.save();

        res.status(201).json({
            newMinistry: ministry,
            message: 'Song Created successfully',
            status_code: 200,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


const addExistingSongAsNew = async (req, res) => {
    try {
        const { ministryId, songId } = req.params;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Find the existing song by ID
        const existingSong = ministry.songs.id(songId);

        if (!existingSong) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Create a new song based on the existing song's details
        const newSong = new Song({
            title: existingSong.title,
            lyrics: existingSong.lyrics,
            intro: existingSong.intro,
            link: existingSong.link,
            lyricslink: existingSong.lyricslink
            // Add other properties as needed
        });

        // Add the new song to the ministry's songs array
        ministry.songs.push(newSong);

        // Save the ministry with the new song
        await ministry.save();

        res.status(201).json({
            newMinistry: ministry,
            message: 'Existing song added as a new song successfully',
            status_code: 200,
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const getMinistrySongs = async (req, res) => {
    try {
        const { ministryId } = req.params;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Return the songs associated with the ministry
        res.status(200).json({ songs: ministry.songs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const deleteMinistrySong = async (req, res) => {
    try {
        const { ministryId, songId } = req.params;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }


        // Find the song by ID within the ministry
        const song = ministry.songs.id(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }
        // Remove the song from the ministry's songs array
        ministry.songs.pull(song);

        // Save the updated ministry
        await ministry.save();

        res.status(200).json({ message: 'Song deleted successfully' });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const updateMinistrySong = async (req, res) => {
    try {
        const { ministryId, songId } = req.params;
        const { title, lyrics, link, intro } = req.body;

        // Find the ministry by ID
        const ministry = await Ministry.findById(ministryId);

        if (!ministry) {
            return res.status(404).json({ message: 'Ministry not found' });
        }

        // Find the song by ID within the ministry
        const song = ministry.songs.id(songId);

        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        // Update the song with new data
        song.set({ title, link, lyrics, intro });

        await ministry.save();

        res.status(200).json({ message: 'Song updated successfully' });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}



const getAllMinistriesSongs = async (req, res) => {
    try {
        const allMinistries = await Ministry.find();

        let allSongs = [];

        allMinistries.forEach(ministry => {
            if (ministry.songs.length > 0) {
                const songsWithMinistryId = ministry.songs.map(song => ({
                    ministryId: ministry._id, // Assuming your ministry ID field is _id
                    songs: song // Assuming your song reference is the songId itself
                }));
                allSongs = allSongs.concat(songsWithMinistryId);
            }
        });

        res.status(200).json({ allSongs });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




module.exports = { createSongs, getMinistrySongs, deleteMinistrySong, updateMinistrySong, getAllMinistriesSongs, addExistingSongAsNew }






