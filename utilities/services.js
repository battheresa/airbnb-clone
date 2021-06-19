import { shuffle } from './customService';
import { initFirestore } from './firebaseConfig';
const db = initFirestore();

// get stays ------------------------------
let storedStays;

export const getStays = async () => {
    if (storedStays)
        return storedStays;
    
    let stays = [];
    const all = await db.collection('stays').get();

    for (let i = 0; i < 5; i ++) {
        all.forEach(item => {
            stays.push(item.data());
        });
    }

    storedStays = stays;
    return stays;
}

export const getStaysByTags = async (tag) => {
    let stays = [];
    
    await getStays().then(content => 
        content.forEach(item => {
            if (item.tags.includes(tag))
                stays.push(item);
        }) 
    );

    return stays;
}

export const getStaysByLocations = async (location) => {
    let stays = [];
    
    await getStays().then(content => 
        content.forEach(item => {
            if (item.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(item.location.toLowerCase()))
                stays.push(item);
        })
    );

    return stays;
}

// get tags -------------------------------
let storedTags;

export const getTags = async () => {
    if (storedTags)
        return storedTags;
    
    let tags = [];
    const all = await db.collection('tags').get();

    all.forEach(item => {
        tags.push(item.data());
    });

    storedTags = tags;
    return tags;
}

// get locations --------------------------
let storedLocations;

export const getLocations = async (id) => {
    if (storedLocations)
        return storedLocations.find(item => item.id === id);
    
    let locations = [];
    const all = await db.collection('locations').get();

    all.forEach(item => {
        locations.push({ docId: item.id, ...item.data() });
    });

    storedLocations = locations;
    return locations.find(item => item.id === id);
}

export const getSearchLocations = async () => {
    let locations = [];

    await getLocations('search').then(content => locations = content.list);

    return locations;
}

export const getTabsLocations = async () => {
    let locations = [];

    await getLocations('tabs').then(content => {
        locations = content.list;
        locations.forEach(item => {
            item.content = shuffle(item.content);
        });
    });
    
    return locations;
}

export const setTabsLocations = async (data) => {
    let tabs = await getLocations('tabs');
    await db.collection('locations').doc(tabs.docId).update({ list: data });
}


