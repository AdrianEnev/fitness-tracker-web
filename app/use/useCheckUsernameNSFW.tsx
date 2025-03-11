const apiToken = import.meta.env.VITE_REACT_APP_HUGGINGFACE_API_TOKEN;

const checkUsernameNSFW = async (username: string) => {

    console.log(apiToken);
    console.log("checking if username is nsfw");

    // FIX: First, check if the username is in the popular names list
    const isInList = await isUsernameInList(username.toLowerCase());
    if (isInList) {
        console.log("username is in popular names list and is safe");
        return false;
    }

    // If the username is NOT in the list, proceed with NSFW detection
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: username,
                parameters: {
                    candidate_labels: ["offensive", "non-offensive"],
                },
            }),
        }
    );

    const data = await response.json();
    console.log(data);

    if (!data || !data.labels || data.labels.length === 0) {
        console.error("Unexpected API response format", data);
        // alert user error if needed
        return true; // Assume NSFW if API fails
    }

    console.log(data.labels[0]);

    if (data.labels[0] === "non-offensive") {
        console.log("username is not nsfw");
        return false;
    }

    console.log("username is nsfw");
    return true;
};

const isUsernameInList = (username: string) => {
    const popularNames = new Set([
        "liam", "olivia", "noah", "emma", "oliver", "ava", "elijah", "charlotte", "james", "sophia",
        "william", "amelia", "benjamin", "isabella", "lucas", "mia", "henry", "evelyn", "alexander", "harper",
        "mason", "luna", "michael", "camila", "ethan", "gianna", "daniel", "abigail", "jacob", "ella",
        "logan", "elizabeth", "jackson", "sofia", "sebastian", "avery", "jack", "scarlett", "aiden", "emily",
        "owen", "aria", "samuel", "penelope", "matthew", "chloe", "joseph", "layla", "levi", "mila",
        "mateo", "nora", "david", "hazel", "john", "madison", "wyatt", "ellie", "carter", "lily",
        "julian", "nova", "luke", "isla", "grayson", "grace", "isaac", "violet", "jayden", "aurora",
        "theodore", "riley", "gabriel", "zoey", "anthony", "willow", "dylan", "emilia", "leo", "stella",
        "lincoln", "zoe", "jaxon", "victoria", "asher", "hannah", "christopher", "addison", "josiah", "leah",
        "andrew", "lucy", "thomas", "eliana", "joshua", "ivy", "ezra", "everly", "adrian", "alex", "jordan",
    ]);

    return Promise.resolve(popularNames.has(username));
};

export default checkUsernameNSFW;
