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
        all.forEach(doc => {
            stays.push(doc.data());
        });
    }

    storedStays = stays;
    return stays;
}

export const getStaysByTags = async (tag) => {
    let stays = [];
    
    await getStays().then(content => 
        content.forEach(data => {
            if (data.tags.includes(tag))
                stays.push(data);
        }) 
    );

    return stays;
}

export const getStaysByLocations = async (location) => {
    let stays = [];
    
    await getStays().then(content => 
        content.forEach(data => {
            if (data.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(data.location.toLowerCase()))
                stays.push(data);
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

    all.forEach(doc => {
        tags.push(doc.data());
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

    all.forEach(doc => {
        locations.push({ docId: doc.id, ...doc.data() });
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


