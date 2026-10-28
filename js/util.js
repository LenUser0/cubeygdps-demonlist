// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
const youtubeIdRegex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
const medalClipRegex = /medal\.tv\/(?:games\/[^/]+\/clips|clip)\/([\w-]+)/i;

export function getYoutubeIdFromUrl(url) {
    return url.match(youtubeIdRegex)?.[1] ?? '';
}

export function embed(video) {
    const medalClipId = video.match(medalClipRegex)?.[1];

    if (medalClipId) {
        return `https://medal.tv/clip/${medalClipId}/embed`;
    }

    return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
}

export function localize(num) {
    return num.toLocaleString();
}

export function getThumbnailFromId(id) {
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

// https://stackoverflow.com/questions/2450954/how-do-i-randomize-shuffle-a-javascript-array
export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the last element.
        const value = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = value;
    }

    return array;
}
