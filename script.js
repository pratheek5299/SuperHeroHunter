var MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    
    function AddUnsigned(lX,lY) {
    var lX4,lY4,lX8,lY8,lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
    if (lResult & 0x40000000) {
    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
    } else {
    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    }
    } else {
    return (lResult ^ lX8 ^ lY8);
    }
    }
    
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
    
    function FF(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
    };
    
    function GG(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
    };
    
    function HH(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
    };
    
    function II(a,b,c,d,x,s,ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
    };
    
    function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1=lMessageLength + 8;
    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
    var lWordArray=Array(lNumberOfWords-1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while ( lByteCount < lMessageLength ) {
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
    lByteCount++;
    }
    lWordCount = (lByteCount-(lByteCount % 4))/4;
    lBytePosition = (lByteCount % 4)*8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
    return lWordArray;
    };
    
    function WordToHex(lValue) {
    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
    for (lCount = 0;lCount<=3;lCount++) {
    lByte = (lValue>>>(lCount*8)) & 255;
    WordToHexValue_temp = "0" + lByte.toString(16);
    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
    }
    return WordToHexValue;
    };
    
    function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    
    for (var n = 0; n < string.length; n++) {
    
    var c = string.charCodeAt(n);
    
    if (c < 128) {
    utftext += String.fromCharCode(c);
    }
    else if((c > 127) && (c < 2048)) {
    utftext += String.fromCharCode((c >> 6) | 192);
    utftext += String.fromCharCode((c & 63) | 128);
    }
    else {
    utftext += String.fromCharCode((c >> 12) | 224);
    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    utftext += String.fromCharCode((c & 63) | 128);
    }
    
    }
    
    return utftext;
    };
    
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    
    string = Utf8Encode(string);
    
    x = ConvertToWordArray(string);
    
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    
    for (k=0;k<x.length;k+=16) {
    AA=a; BB=b; CC=c; DD=d;
    a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
    d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
    c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
    b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
    a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
    d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
    c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
    b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
    a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
    d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
    c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
    b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
    d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
    c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
    b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
    a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
    d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
    c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
    b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
    a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
    d=GG(d,a,b,c,x[k+10],S22,0x2441453);
    c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
    b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
    a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
    d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
    c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
    b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
    d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
    c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
    b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
    a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
    d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
    c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
    b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
    a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
    d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
    c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
    b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
    d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
    c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
    b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
    a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
    d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
    c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
    b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
    a=II(a,b,c,d,x[k+0], S41,0xF4292244);
    d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
    c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
    b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
    d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
    c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
    b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
    a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
    d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
    c=II(c,d,a,b,x[k+6], S43,0xA3014314);
    b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
    a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
    d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
    c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
    b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
    a=AddUnsigned(a,AA);
    b=AddUnsigned(b,BB);
    c=AddUnsigned(c,CC);
    d=AddUnsigned(d,DD);
    }
    
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    
    return temp.toLowerCase();
    }

var searchInputEl = document.getElementById('searchInput');
var display = document.getElementById('display');
var names = [
    "3-D Man",
    "A-Bomb (HAS)",
    "A.I.M.",
    "Aaron Stack",
    "Abomination (Emil Blonsky)",
    "Abomination (Ultimate)",
    "Absorbing Man",
    "Abyss",
    "Abyss (Age of Apocalypse)",
    "Adam Destine",
    "Adam Warlock",
    "Aegis (Trey Rollins)",
    "Aero (Aero)",
    "Agatha Harkness",
    "Agent Brand",
    "Agent X (Nijo)",
    "Agent Zero",
    "Agents of Atlas",
    "Aginar",
    "Air-Walker (Gabriel Lan)",
    "Ajak",
    "Ajaxis",
    "Akemi",
    "Alain",
    "Albert Cleary",
    "Albion",
    "Alex Power",
    "Alex Wilder",
    "Alexa Mendez",
    "Alexander Pierce",
    "Alice",
    "Alicia Masters",
    "Alpha Flight",
    "Alpha Flight (Ultimate)",
    "Alvin Maker",
    "Amadeus Cho",
    "Amanda Sefton",
    "Amazoness",
    "American Eagle (Jason Strongbow)",
    "Amiko",
    "Amora",
    "Amphibian (Earth-712)",
    "Amun",
    "Ancient One",
    "Ancient One (Ultimate)",
    "Angel (Angel Salvadore)",
    "Angel (Thomas Halloway)",
    "Angel (Ultimate)",
    "Angel (Warren Worthington III)",
    "Angela (Aldrif Odinsdottir)",
    "Anita Blake",
    "Anne Marie Hoag",
    "Annihilus",
    "Anole",
    "Ant-Man (Eric O'Grady)",
    "Ant-Man (Hank Pym)",
    "Ant-Man (Scott Lang)",
    "Anthem",
    "Apocalypse",
    "Apocalypse (Ultimate)",
    "Aqueduct",
    "Arachne",
    "Araña",
    "Arcade",
    "Arcana",
    "Archangel",
    "Arclight",
    "Ares",
    "Argent",
    "Armadillo",
    "Armor (Hisako Ichiki)",
    "Armory",
    "Arnim Zola",
    "Arsenic",
    "Artiee",
    "Asgardian",
    "Askew-Tronics",
    "Asylum",
    "Atlas (Team)",
    "Attuma",
    "Aurora",
    "Avalanche",
    "Avengers",
    "Avengers (Ultimate)",
    "Azazel (Mutant)",
    "Balder",
    "Banshee",
    "Banshee (Theresa Rourke)",
    "Baron Mordo (Karl Mordo)",
    "Baron Strucker",
    "Baron Zemo (Heinrich Zemo)",
    "Baron Zemo (Helmut Zemo)",
    "Baroness S'Bak",
    "Barracuda",
    "Bart Rozum",
    "Bastion",
    "Batroc the Leaper",
    "Battering Ram",
    "Battlestar",
    "Beak",
    "Beast",
    "Beast (Earth-311)",
    "Beast (Ultimate)",
    "Becatron",
    "Bedlam",
    "Beef",
    "Beetle (Abner Jenkins)",
    "Belasco",
    "Ben Grimm",
    "Ben Parker",
    "Ben Reilly",
    "Ben Urich",
    "Bengal",
    "Beta-Ray Bill",
    "Bethany Cabe",
    "Betty Brant",
    "Betty Ross",
    "Beyonder",
    "Bi-Beast",
    "Big Bertha",
    "Big Wheel",
    "Bill Hollister",
    "Bishop",
    "Bishop (Ultimate)",
    "Black Bird",
    "Black Bolt",
    "Black Bolt (Marvel War of Heroes)",
    "Black Cat",
    "Black Cat (Ultimate)",
    "Black Crow",
    "Black Knight (Dane Whitman)",
    "Black Knight (Sir Percy of Scandia)",
    "Black Panther",
    "Black Panther (Shuri)",
    "Black Panther (Ultimate)",
    "Black Queen",
    "Black Tarantula",
    "Black Tom",
    "Black Widow",
    "Black Widow (LEGO Marvel Super Heroes)",
    "Black Widow (Ultimate)",
    "Black Widow (Yelena Belova)",
    "Black Widow/Natasha Romanoff (MAA)",
    "Blackheart",
    "Blacklash",
    "Blackout",
    "Blade",
    "Blastaar",
    "Blazing Skull",
    "Blindfold",
    "Bling!",
    "Blink",
    "Blizzard",
    "Blob",
    "Blob (Ultimate)",
    "Blockbuster",
    "Blok",
    "Bloke",
    "Blonde Phantom",
    "Bloodaxe",
    "Bloodscream",
    "Bloodstorm",
    "Bloodstrike",
    "Blue Blade",
    "Blue Marvel",
    "Blue Shield",
    "Blur",
    "Bob, Agent of Hydra",
    "Boom Boom",
    "Boomer",
    "Boomerang",
    "Box",
    "Bride of Nine Spiders (Immortal Weapons)",
    "Bromley",
    "Brood",
    "Brother Voodoo",
    "Brotherhood of Evil Mutants",
    "Brotherhood of Mutants (Ultimate)",
    "Bruce Banner",
    "Brute",
    "Bucky",
    "Bug",
    "Bulldozer",
    "Bullseye",
    "Bushwacker",
    "Butterfly",
    "Cable",
    "Cable (Deadpool)",
    "Cable (Marvel: Avengers Alliance)",
    "Cable (Ultimate)",
    "Cable (X-Men: Battle of the Atom)",
    "Calamity",
    "Caliban",
    "Callisto",
    "Callisto (Age of Apocalypse)",
    "Calypso",
    "Cammi",
    "Cannonball",
    "Cap'n Oz",
    "Captain America",
    "Captain America (House of M)",
    "Captain America (LEGO Marvel Super Heroes)",
    "Captain America (Marvel War of Heroes)",
    "Captain America (Sam Wilson)",
    "Captain America (Ultimate)",
    "Captain America/Steve Rogers (MAA)",
    "Captain Britain",
    "Captain Britain (Betsy Braddock)",
    "Captain Britain (Ultimate)",
    "Captain Cross",
    "Captain Flint",
    "Captain Marvel (Carol Danvers)",
    "Captain Marvel (Genis-Vell)",
    "Captain Marvel (Mar-Vell)",
    "Captain Marvel (Monica Rambeau)",
    "Captain Marvel (Phyla-Vell)",
    "Captain Midlands",
    "Captain Stacy",
    "Captain Universe",
    "Cardiac",
    "Caretaker",
    "Cargill",
    "Carlie Cooper",
    "Carmella Unuscione",
    "Carnage",
    "Carnage (Ultimate)",
    "Carol Danvers",
    "Carol Hines",
    "Carrion (Malcolm McBride)",
    "Cassandra Nova",
    "Catseye",
    "Cecilia Reyes",
    "Celestials",
    "Centennial",
    "Centurions",
    "Cerebro",
    "Cerise",
    "Ch'od",
    "Chamber",
    "Chameleon",
    "Champions",
    "Changeling",
    "Charles Xavier",
    "Charlie Campion",
    "Charlie-27",
    "Chase Stein",
    "Chat",
    "Chimera",
    "Chores MacGillicudy",
    "Christian Walker",
    "Chronomancer",
    "Chthon",
    "ClanDestine",
    "Clea",
    "Clea (Ultimate)",
    "Clint Barton",
    "Cloak",
    "Cloud 9",
    "Cobalt Man",
    "Colleen Wing",
    "Colonel America",
    "Colossus",
    "Colossus (Ultimate)",
    "Confederates of the Curious",
    "Constrictor",
    "Contessa (Vera Vidal)",
    "Controller",
    "Cornelius",
    "Corsair",
    "Cosmo (dog)",
    "Cottonmouth",
    "Count Nefaria",
    "Countess",
    "Crimson Crusader",
    "Crimson Dynamo",
    "Crimson Dynamo (Iron Man 3 - The Official Game)",
    "Crimson King",
    "Crossbones",
    "Crule",
    "Crusher Hogan",
    "Crusher Hogan (Ultimate)",
    "Crystal",
    "Cuckoo",
    "Curt Conners",
    "Cuthbert",
    "Cyber",
    "Cyclops",
    "Cyclops (Ultimate)",
    "Cyclops (X-Men: Battle of the Atom)",
    "Cypher",
    "D'Ken Neramani",
    "Dagger",
    "Daily Bugle",
    "Daimon Hellstrom",
    "Daken",
    "Dakota North",
    "Damage Control",
    "Dani Moonstar",
    "Danny Rand",
    "Daredevil",
    "Daredevil (LEGO Marvel Super Heroes)",
    "Daredevil (Marvel Heroes)",
    "Daredevil (Ultimate)",
    "Dargo Ktor",
    "Dark Avengers",
    "Dark Beast",
    "Dark Phoenix",
    "Dark X-Men",
    "Darkhawk",
    "Darkstar",
    "Darwin",
    "Dazzler",
    "Dazzler (Ultimate)",
    "Deacon Frost",
    "Dead Girl",
    "Deadpool",
    "Deadpool (Deadpool)",
    "Deadpool (LEGO Marvel Super Heroes)",
    "Deadpool (X-Men: Battle of the Atom)",
    "Death",
    "Deathbird",
    "Deathcry",
    "Deathlok",
    "Deathstrike (Ultimate)",
    "Debra Whitman",
    "Debrii",
    "Deena Pilgrim",
    "Defenders",
    "Demogoblin",
    "Destiny",
    "Detective Soap",
    "Deviants",
    "Devil Dinosaur (Devil Dinosaur)",
    "Devil Dinosaur (HAS)",
    "Devos",
    "Dexter Bennett",
    "Diablo",
    "Diamondback (Rachel Leighton)",
    "Dinah Soar",
    "Dirk Anger",
    "Doc Samson",
    "Doctor Doom",
    "Doctor Doom (Ultimate)",
    "Doctor Faustus",
    "Doctor Octopus",
    "Doctor Octopus (Ultimate)",
    "Doctor Spectrum",
    "Doctor Strange",
    "Doctor Strange (Ultimate)",
    "Doctor Voodoo",
    "Dog Brother #1",
    "Domino",
    "Donald Blake",
    "Doomsday Man",
    "Doop",
    "Doorman",
    "Dora Milaje",
    "Dorian Gray",
    "Dormammu",
    "Dormammu (Ultimate)",
    "Dr. Strange (Marvel: Avengers Alliance)",
    "Dracula",
    "Dragon Lord",
    "Dragon Man",
    "Drax",
    "Dreadnoughts",
    "Dreaming Celestial",
    "Druig",
    "Dum Dum Dugan",
    "Dust",
    "Earthquake",
    "Echo",
    "Eddie Brock",
    "Eddie Lau",
    "Edward \"Ted\" Forrester",
    "Edwin Jarvis",
    "Ego",
    "Electro",
    "Electro (Ultimate)",
    "Elektra",
    "Elektra (Ultimate)",
    "Elements of Doom",
    "Elite",
    "Elixir",
    "Elloe Kaifi",
    "Elsa Bloodstone",
    "Emma Frost",
    "Empath",
    "Emplate",
    "Enchantress (Amora)",
    "Enchantress (Sylvie Lushton)",
    "Ender Wiggin",
    "Energizer",
    "Epoch",
    "Erik the Red",
    "Eternals",
    "Eternity",
    "Excalibur",
    "Executioner (Skurge)",
    "Exiles",
    "Exodus",
    "Expediter",
    "Ezekiel",
    "Ezekiel Stane",
    "Fabian Cortez",
    "Falcon",
    "Falcon/Sam Wilson (MAA)",
    "Fallen One",
    "Famine",
    "Fantastic Four",
    "Fantastic Four (Ultimate)",
    "Fantastick Four",
    "Fantomex",
    "Fat Cobra",
    "Felicia Hardy",
    "Fenris",
    "Feral",
    "Fin Fang Foom",
    "Firebird",
    "Firebrand",
    "Firedrake",
    "Firelord",
    "Firestar",
    "Firestar (Ultimate)",
    "Fixer (Paul Norbert Ebersol)",
    "Flatman",
    "Flying Dutchman",
    "Foggy Nelson",
    "Force Works",
    "Forearm",
    "Forge",
    "Forge (Ultimate)",
    "Forgotten One",
    "Frank Castle",
    "Frankenstein's Monster",
    "Franklin Richards",
    "Franklin Storm",
    "Freak",
    "Frenzy",
    "Frightful Four",
    "Frog Thor",
    "Frog-Man",
    "Gabe Jones",
    "Galactus",
    "Galia",
    "Gambit",
    "Gamma Corps",
    "Gamora",
    "Gamora (Marvel War of Heroes)",
    "Gargoyle",
    "Gargoyle (Isaac Christians)",
    "Gargoyle (Yuri Topolov)",
    "Garia",
    "Garrison Kane",
    "Gateway",
    "Gauntlet (Joseph Green)",
    "Geiger",
    "Gene Sailors",
    "Generation X",
    "Genesis",
    "Genis-Vell",
    "George Stacy (Ultimate)",
    "Gertrude Yorkes",
    "Ghost Rider (Daniel Ketch)",
    "Ghost Rider (Johnny Blaze)",
    "Ghost Rider (Marvel War of Heroes)",
    "Ghost Rider (Robbie Reyes)",
    "Giant Girl",
    "Giant Man",
    "Giant-dok",
    "Giant-Man (Ultimate)",
    "Gideon",
    "Gilgamesh",
    "Git Hoskins",
    "Gladiator (Kallark)",
    "Gladiator (Melvin Potter)",
    "Glenn Talbot",
    "Glorian",
    "Goblin Queen",
    "Golden Guardian",
    "Goliath (Bill Foster)",
    "Gorgon",
    "Gorgon (Inhumans)",
    "Gorilla Man",
    "Grandmaster",
    "Graviton",
    "Gravity",
    "Great Lakes Avengers",
    "Green Goblin (Barry Norman Osborn)",
    "Green Goblin (Harry Osborn)",
    "Green Goblin (Norman Osborn)",
    "Green Goblin (Ultimate)",
    "Gressill",
    "Grey Gargoyle",
    "Greymalkin",
    "Grim Reaper",
    "Groot",
    "Guardian",
    "Guardians of the Galaxy",
    "Guardsmen",
    "Gunslinger",
    "GW Bridge",
    "Gwen Stacy",
    "Gwen Stacy (Ultimate)",
    "H.A.M.M.E.R.",
    "H.E.R.B.I.E.",
    "Hairball",
    "Half-Life (Tony Masterson)",
    "Hammerhead",
    "Hammerhead (Ultimate)",
    "Hank Pym",
    "Hannibal King",
    "Happy Hogan",
    "Hardball",
    "Harley Davidson Cooper",
    "Harpoon",
    "Harrier",
    "Harry Heck",
    "Harry Osborn",
    "Harry Osborn (Ultimate)",
    "Hate-Monger (Adolf Hitler)",
    "Havok",
    "Hawkeye",
    "Hawkeye (Kate Bishop)",
    "Hawkeye (Marvel Heroes)",
    "Hawkeye (Ultimate)",
    "Hawkeye/Clint Barton (MAA)",
    "Hecate (Ravonna Renslayer)",
    "Hedge Knight",
    "Hela",
    "Hellcat (Patsy Walker)",
    "Hellfire Club",
    "Hellfire Club (Ultimate)",
    "Hellion",
    "Hellions (Squad)",
    "Hemingway",
    "Henry Peter Gyrich",
    "Hepzibah",
    "Hercules",
    "Heroes For Hire",
    "Hex",
    "High Evolutionary",
    "Hindsight Lad",
    "Hiroim",
    "Hit-Monkey",
    "Hitman",
    "Hitomi Sakuma",
    "Hobgoblin (Jason Macendale)",
    "Hobgoblin (Robin Borne)",
    "Hobgoblin (Roderick Kingsley)",
    "Holocaust (Age of Apocalypse)",
    "Holy",
    "Honey Badger (Gabrielle Kinney)",
    "Hope Summers",
    "Howard Saint",
    "Howard The Duck",
    "Hulk",
    "Hulk (HAS)",
    "Hulk (LEGO Marvel Super Heroes)",
    "Hulk (Marvel Zombies)",
    "Hulk (Marvel: Avengers Alliance)",
    "Hulk (Ultimate)",
    "Hulk-dok",
    "Hulk/Bruce Banner (MAA)",
    "Hulkling",
    "Human Cannonball",
    "Human Fly (Richard Deacon)",
    "Human Robot",
    "Human Torch",
    "Human Torch (Jim Hammond)",
    "Human Torch (Ultimate)",
    "Humbug",
    "Husk",
    "Hussar",
    "Hydra",
    "Hydro-Man",
    "Hyperion (Earth-712)",
    "Hypno-Hustler",
    "Iceman",
    "Iceman (Ultimate)",
    "Iceman (X-Men: Battle of the Atom)",
    "Ikaris",
    "Illuminati",
    "Ilyana Rasputin",
    "Immortus",
    "Imp",
    "Imperfects",
    "Imperial Guard",
    "Impossible Man",
    "In-Betweener",
    "Inertia",
    "Infant Terrible",
    "Inhumans",
    "Ink",
    "Invaders",
    "Invisible Woman",
    "Invisible Woman (Marvel: Avengers Alliance)",
    "Invisible Woman (Ultimate)",
    "Iron Cross Army",
    "Iron Fist (Bei Bang-Wen)",
    "Iron Fist (Danny Rand)",
    "Iron Fist (Orson Randall)",
    "Iron Fist (Quan Yaozu)",
    "Iron Fist (USM)",
    "Iron Fist (Wu Ao-Shi)",
    "Iron Lad",
    "Iron Man",
    "Iron Man (Iron Man 3 - The Official Game)",
    "Iron Man (LEGO Marvel Super Heroes)",
    "Iron Man (Marvel Heroes)",
    "Iron Man (Marvel War of Heroes)",
    "Iron Man (Ultimate)",
    "Iron Man/Tony Stark (MAA)",
    "Iron Monger",
    "Iron Patriot",
    "Iron Patriot (James Rhodes)",
    "Ironclad",
    "Ironheart (Riri Williams)",
    "Isaiah Bradley",
    "J. Jonah Jameson",
    "Jack Flag",
    "Jack Murdock",
    "Jack O' Lantern",
    "Jack Power",
    "Jackal",
    "Jackpot",
    "James Buchanan Barnes",
    "James Howlett",
    "Jamie Braddock",
    "Jane Foster",
    "Janus, the Nega-Man",
    "Jasper Sitwell",
    "Jazinda",
    "Jean Grey",
    "Jean Grey",
    "Jean Grey (Ultimate)",
    "Jennifer Smith",
    "Jeryn Hogarth",
    "Jessica Drew",
    "Jessica Jones",
    "Jetstream",
    "Jigsaw",
    "Jimmy Woo",
    "Joan the Mouse",
    "Jocasta",
    "John Farson",
    "John Jameson",
    "John Porter",
    "John Wraith",
    "Johnny Blaze",
    "Johnny Storm",
    "Joseph",
    "Joshua Kane",
    "Josiah X",
    "Joystick",
    "Jubilee",
    "Jubilee (Age of Apocalypse)",
    "Juggernaut",
    "Jule Carpenter",
    "Julian Keller",
    "Junta",
    "Justice",
    "Justin Hammer",
    "Ka-Zar",
    "Kabuki",
    "Kang",
    "Karen O'Malley",
    "Karen Page",
    "Karma",
    "Karnak",
    "Karolina Dean ",
    "Kat Farrell",
    "Kate Bishop",
    "Katie Power",
    "Ken Ellis",
    "Khan",
    "Kid Colt",
    "Killer Shrike",
    "Killmonger",
    "Killraven",
    "King Bedlam",
    "King Cobra",
    "Kingpin",
    "Kinsey Walden",
    "Kitty Pryde",
    "Kitty Pryde (X-Men: Battle of the Atom)",
    "Klaw",
    "Komodo (Melati Kusuma)",
    "Korath",
    "Korg",
    "Korvac",
    "Krakoa",
    "Kraven the Hunter",
    "Kree",
    "Krista Starr",
    "Kronos",
    "Kulan Gath",
    "Kwannon",
    "Kylun",
    "La Nuit",
    "Lady Bullseye",
    "Lady Deathstrike",
    "Lady Mastermind",
    "Lady Ursula",
    "Lady Vermin",
    "Lake",
    "Landau",
    "Lava-Man",
    "Layla Miller",
    "Leader",
    "Leech",
    "Legion",
    "Lei Kung, The Thunderer",
    "Lenny Balinger",
    "Leo (Zodiac)",
    "Leopardon",
    "Leper Queen",
    "Lester",
    "Lethal Legion",
    "Lieutenant Marcus Stone",
    "Lifeguard",
    "Lightning Lords of Nepal",
    "Lightspeed",
    "Lila Cheney",
    "Lilandra",
    "Lilith",
    "Lily Hollister",
    "Lionheart",
    "Living Laser",
    "Living Lightning",
    "Living Mummy",
    "Living Tribunal",
    "Liz Osborn",
    "Lizard",
    "Lizard (Ultimate)",
    "Loa",
    "Lockheed",
    "Lockjaw",
    "Logan",
    "Loki",
    "Loki (LEGO Marvel Super Heroes)",
    "Loners",
    "Longshot",
    "Longshot (Ultimate)",
    "Lord Hawal",
    "Lord Tyger",
    "Lords of Avalon",
    "Lorna Dane",
    "Luckman",
    "Lucky Pierre",
    "Lucy in the Sky",
    "Luke Cage",
    "Luminals",
    "Luna Snow (Luna Snow)",
    "Lyja",
    "M (Monet St. Croix)",
    "M.O.D.A.M.",
    "M.O.D.O.G.",
    "M.O.D.O.K.",
    "M.O.D.O.K. (Iron Man 3 - The Official Game)",
    "Ma Gnuci",
    "Mac Gargan",
    "Mach IV",
    "Machine Man",
    "Mad Thinker",
    "Madame Hydra",
    "Madame Masque",
    "Madame Web (Julia Carpenter)",
    "Maddog",
    "Madelyne Pryor",
    "Madripoor",
    "Madrox",
    "Maelstrom",
    "Maestro",
    "Magdalene",
    "Maggott",
    "Magik (Amanda Sefton)",
    "Magik (Illyana Rasputin)",
    "Maginty",
    "Magma (Amara Aquilla)",
    "Magneto",
    "Magneto (Age of Apocalypse)",
    "Magneto (House of M)",
    "Magneto (Ultimate)",
    "Magneto (X-Men: Battle of the Atom)",
    "Magus (Adam Warlock)",
    "Magus (Technarch)",
    "Major Mapleleaf",
    "Makkari",
    "Malcolm Colcord",
    "Malekith",
    "Malice (Earth-161)",
    "Man-Thing",
    "Man-Wolf",
    "Mandarin",
    "Mandrill",
    "Mandroid",
    "Manta",
    "Mantis",
    "Marauders",
    "Marcus Van Sciver",
    "Maria Hill",
    "Mariko Yashida",
    "Marrow",
    "Marten Broadcloak",
    "Martin Li",
    "Marvel Apes",
    "Marvel Boy",
    "Marvel Zombies",
    "Marvelman",
    "Marvex",
    "Mary Jane Watson",
    "Mary Jane Watson (House of M)",
    "Mary Jane Watson (Ultimate)",
    "Masked Marvel (Unrevealed)",
    "Masque",
    "Master Chief",
    "Master Mold",
    "Mastermind",
    "Masters of Evil",
    "Mathemanic",
    "Matsu'o Tsurayaba",
    "Matthew Murdock",
    "Mattie Franklin",
    "Mauler",
    "Maverick (Chris Bradley)",
    "Maverick (Christoph Nord)",
    "Maximus",
    "May Parker",
    "Medusa",
    "Meggan",
    "Meltdown",
    "Menace",
    "Mentallo",
    "Mentor",
    "Mephisto",
    "Mephistopheles",
    "Mercury",
    "Mesmero",
    "Metal Master",
    "Meteorite",
    "MI: 13",
    "Micro/Macro",
    "Microbe",
    "Microchip",
    "Micromax",
    "Midnight (Earth-811)",
    "Miek",
    "Mikhail Rasputin",
    "Millenium Guard",
    "Millie the Model",
    "Mimic",
    "Mindworm",
    "Miracleman",
    "Miss America",
    "Mister Fear",
    "Mister Sinister",
    "Mister Sinister (Deadpool)",
    "Mister Sinister (House of M)",
    "Mister Sinister (Ultimate)",
    "Misty Knight",
    "Mockingbird",
    "Moira MacTaggert",
    "Moira MacTaggert (Ultimate)",
    "Mojo",
    "Mole Man",
    "Molecule Man",
    "Molly Hayes",
    "Molly Von Richtofen",
    "Molten Man",
    "Mongoose",
    "Mongu (Unrevealed)",
    "Monster Badoon",
    "Moon Girl (Lunella Layfayette)",
    "Moon Knight",
    "Moon Knight (House of M)",
    "Moon Knight (Ultimate)",
    "Moondragon",
    "Moonstone",
    "Morbius",
    "Mordo",
    "Morg",
    "Morgan Le Fay",
    "Morgan Stark",
    "Morlocks",
    "Morlun",
    "Morph",
    "Mother Askani",
    "Mr. Bumpo",
    "Mr. Fantastic",
    "Mr. Fantastic (Ultimate)",
    "Mr. Fish",
    "Mr. Fixit",
    "Mr. Hyde",
    "Mr. Immortal",
    "Mr. Meugniot",
    "Mr. Negative",
    "Mr. Payback",
    "Mr. X",
    "Ms. America (America Chavez)",
    "Ms. Marvel (Kamala Khan)",
    "MS2",
    "Mulholland Black",
    "Multiple Man",
    "MVP",
    "Mysterio",
    "Mysterio (Daniel Berkhart)",
    "Mysterio (Francis Klum)",
    "Mystique",
    "Mystique (Age of Apocalypse)",
    "Mystique (House of M)",
    "Mystique (Ultimate)",
    "Nakia (Nakia)",
    "Namor",
    "Namora",
    "Namorita",
    "Naoko",
    "Natasha Romanoff",
    "Nebula",
    "Nehzno",
    "Nekra",
    "Nemesis",
    "Network",
    "New Goblin",
    "New Mutants",
    "New Warriors",
    "New X-Men",
    "Newton Destine",
    "Next Avengers",
    "Nextwave",
    "Nick Fury",
    "Nick Fury (LEGO Marvel Super Heroes)",
    "Nick Fury (Ultimate)",
    "Nico Minoru",
    "Nicolaos",
    "Night Nurse (Earth-9997)",
    "Night Nurse (Linda Carter)",
    "Night Thrasher",
    "Night Thrasher (Dwayne Taylor)",
    "Nightcrawler",
    "Nightcrawler (Ultimate)",
    "Nighthawk",
    "Nightmare",
    "Nightshade",
    "Nine-Fold Daughters of Xao",
    "Nitro",
    "Nocturne",
    "Nomad",
    "Nomad (Rikki Barnes)",
    "Nomad (Steve Rogers)",
    "Norman Osborn",
    "Norrin Radd",
    "Northstar",
    "Nova",
    "Nova (Frankie Raye)",
    "Nova (Sam Alexander)",
    "Nova (USM)",
    "Nuke",
    "Obadiah Stane",
    "Odin",
    "Ogun",
    "Okoye",
    "Old Lace",
    "Old Man Logan (Earth-807128)",
    "Omega (Michael Pointer)",
    "Omega Flight",
    "Omega Red",
    "Omega Sentinel",
    "Omega the Unknown",
    "Onslaught",
    "Onslaught (Ultimate)",
    "Oracle",
    "Ord",
    "Orphan",
    "Orphan-Maker",
    "Otto Octavius",
    "Outlaw (Inez Temple)",
    "Outlaw Kid",
    "Overlord",
    "Owl",
    "Ozymandias",
    "Paibok",
    "Paladin",
    "Pandemic",
    "Paper Doll",
    "Patch",
    "Patriot",
    "Payback",
    "Peggy Carter (Captain Carter)",
    "Penance (Monet St. Croix)",
    "Penance (Robert Baldwin)",
    "Pepper Potts",
    "Pestilence",
    "Pet Avengers",
    "Pete Wisdom",
    "Peter Parker",
    "Peter Quill",
    "Phalanx",
    "Phantom Reporter",
    "Phil Coulson (Phil Coulson)",
    "Phil Sheldon",
    "Phoenix Force",
    "Photon",
    "Phyla-Vell",
    "Piledriver",
    "Pip",
    "Pixie",
    "Plazm",
    "Polaris",
    "Post",
    "Power Man (USM)",
    "Power Pack",
    "Praxagora",
    "Preak",
    "Pretty Boy",
    "Pride",
    "Prima",
    "Prince of Orphans",
    "Princess Powerful",
    "Prism",
    "Prodigy",
    "Prodigy (David Alleyne)",
    "Proemial Gods",
    "Professor Monster",
    "Professor X",
    "Professor X (Ultimate)",
    "Proteus",
    "Proteus (House of M)",
    "Proteus (Ultimate)",
    "Proudstar",
    "Prowler",
    "Prowler (Rick Lawson)",
    "Psycho-Man",
    "Psylocke",
    "PsyNapse",
    "Puck",
    "Puck (Zuzha Yu)",
    "Puff Adder",
    "pug",
    "Puma",
    "Punisher",
    "Punisher (2099)",
    "Punisher (Marvel: Avengers Alliance)",
    "Puppet Master",
    "Purifiers",
    "Purple Man",
    "Pyro",
    "Quake (Daisy Johnson)",
    "Quasar (Phyla-Vell)",
    "Quasar (Wendell Vaughn)",
    "Quasimodo",
    "Queen Noir",
    "Quentin Quire",
    "Quicksilver",
    "Quicksilver (Age of Apocalypse)",
    "Quicksilver (Ultimate)",
    "Rachel Grey",
    "Radioactive Man",
    "Rafael Vega",
    "Rage",
    "Raider",
    "Randall",
    "Randall Flagg",
    "Random",
    "Rattler",
    "Ravenous",
    "Rawhide Kid",
    "Raza",
    "Reaper",
    "Reavers",
    "Reavers (Ultimate)",
    "Red 9",
    "Red Ghost",
    "Red Ghost (Ultimate)",
    "Red Guardian (Alexei Shostakov)",
    "Red Hulk",
    "Red Hulk (HAS)",
    "Red She-Hulk",
    "Red Shift",
    "Red Skull",
    "Red Skull (Albert Malik)",
    "Red Wolf",
    "Redwing",
    "Reptil",
    "Retro Girl",
    "Revanche",
    "Rhino",
    "Rhodey",
    "Richard Fisk",
    "Rick Jones",
    "Rick Jones (Ultimate)",
    "Ricochet",
    "Rictor",
    "Riptide",
    "Risque",
    "Robbie Robertson",
    "Robert Baldwin ",
    "Robin Chapel",
    "Rocket Raccoon",
    "Rocket Raccoon (Marvel Heroes)",
    "Rocket Racer",
    "Rockslide",
    "Rogue",
    "Rogue (Age of Apocalypse)",
    "Rogue (Deadpool)",
    "Rogue (Ultimate)",
    "Rogue (X-Men: Battle of the Atom)",
    "Roland Deschain",
    "Romulus",
    "Ronan",
    "Ronin",
    "Roughhouse",
    "Roulette",
    "Roxanne Simpson",
    "Rumiko Fujikawa",
    "Runaways",
    "Russian",
    "S.H.I.E.L.D.",
    "Sabra",
    "Sabretooth",
    "Sabretooth (Age of Apocalypse)",
    "Sabretooth (House of M)",
    "Sabretooth (Ultimate)",
    "Sage",
    "Salem's Seven (Ultimate)",
    "Sally Floyd",
    "Salo",
    "Sandman",
    "Santa Claus",
    "Saracen (Muzzafar Lambert)",
    "Sasquatch (Walter Langkowski)",
    "Satana",
    "Sauron",
    "Scalphunter",
    "Scarecrow (Ebenezer Laughton)",
    "Scarlet Spider (Ben Reilly)",
    "Scarlet Spider (Kaine)",
    "Scarlet Witch",
    "Scarlet Witch (Age of Apocalypse)",
    "Scarlet Witch (Marvel Heroes)",
    "Scarlet Witch (Ultimate)",
    "Scorpion (Carmilla Black)",
    "Scorpion (Mac Gargan)",
    "Scorpion (Ultimate)",
    "Scourge",
    "Scrambler",
    "Scream (Donna Diego)",
    "Screwball",
    "Sebastian Shaw",
    "Secret Warriors",
    "Selene",
    "Senator Kelly",
    "Sentinel",
    "Sentinels",
    "Sentry (Robert Reynolds)",
    "Ser Duncan",
    "Serpent Society",
    "Sersi",
    "Shadow King",
    "Shadow King (Age of Apocalypse)",
    "Shadowcat",
    "Shadowcat (Age of Apocalypse)",
    "Shadowcat (Ultimate)",
    "Shadu the Shady",
    "Shalla-bal",
    "Shaman",
    "Shane Yamada-Jones",
    "Shang-Chi",
    "Shang-Chi (Ultimate)",
    "Shanna the She-Devil",
    "Shape",
    "Shard",
    "Sharon Carter",
    "Sharon Ventura",
    "Shatterstar",
    "She-Hulk (HAS)",
    "She-Hulk (Jennifer Walters)",
    "She-Hulk (Lyra)",
    "She-Hulk (Marvel War of Heroes)",
    "She-Hulk (Ultimate)",
    "Shen",
    "Sheva Callister",
    "Shi'Ar",
    "Shinko Yamashiro",
    "Shinobi Shaw",
    "Shiva",
    "Shiver Man",
    "Shocker (Herman Schultz)",
    "Shockwave",
    "Shooting Star",
    "Shotgun",
    "Shriek",
    "Sif",
    "Silhouette",
    "Silk (Cindy Moon)",
    "Silk Fever",
    "Silver Centurion",
    "Silver Fox",
    "Silver Sable",
    "Silver Samurai",
    "Silver Samurai (Age of Apocalypse)",
    "Silver Surfer",
    "Silverclaw",
    "Silvermane",
    "Sin",
    "Sinister Six",
    "Sir Ram",
    "Siren (Earth-93060)",
    "Sister Grimm",
    "Skaar",
    "Skaar (HAS)",
    "Skin",
    "Skreet",
    "Skrulls",
    "Skrulls (Ultimate)",
    "Skullbuster (Cylla Markham)",
    "Slapstick",
    "Slayback",
    "Sleeper",
    "Sleepwalker",
    "Slipstream",
    "Slyde",
    "Smasher (Vril Rokk)",
    "Smiling Tiger",
    "Snowbird",
    "Solo (James Bourne)",
    "Songbird",
    "Sons of the Tiger",
    "Spacker Dave",
    "Spectrum",
    "Speed",
    "Speed Demon",
    "Speedball (Robert Baldwin)",
    "Spencer Smythe",
    "Sphinx (Anath-Na Mut)",
    "Spider-dok",
    "Spider-Girl (Anya Corazon)",
    "Spider-Girl (May Parker)",
    "Spider-Gwen (Gwen Stacy)",
    "Spider-Ham (Larval Earth)",
    "Spider-Man (1602)",
    "Spider-Man (2099)",
    "Spider-Man (Ai Apaec)",
    "Spider-Man (Ben Reilly)",
    "Spider-Man (House of M)",
    "Spider-Man (LEGO Marvel Super Heroes)",
    "Spider-Man (Marvel Zombies)",
    "Spider-Man (Marvel: Avengers Alliance)",
    "Spider-Man (Miles Morales)",
    "Spider-Man (Noir)",
    "Spider-Man (Peter Parker)",
    "Spider-Man (Takuya Yamashiro)",
    "Spider-Man (Ultimate)",
    "Spider-Woman (Charlotte Witter)",
    "Spider-Woman (Jessica Drew)",
    "Spider-Woman (Mattie Franklin)",
    "Spiral (Rita Wayword)",
    "Spirit",
    "Spitfire",
    "Spot",
    "Sprite",
    "Spyke",
    "Squadron Sinister",
    "Squadron Supreme (Earth-712)",
    "Squirrel Girl",
    "Stacy X",
    "Stacy X (Ultimate)",
    "Star Brand",
    "Star-Lord (Peter Quill)",
    "Starbolt",
    "Stardust",
    "Starfox",
    "Starhawk (Stakar Ogord)",
    "Starjammers",
    "Stark Industries",
    "Stature",
    "Steel Serpent (Davos)",
    "Stegron",
    "Stellaris",
    "Stepford Cuckoos",
    "Stephanie de la Spiroza",
    "Stephen Strange",
    "Steve Rogers",
    "Stick",
    "Stilt-Man (Wibur Day)",
    "Stingray (Walter Newell)",
    "Stone Men",
    "Storm",
    "Storm (Age of Apocalypse)",
    "Storm (Marvel Heroes)",
    "Storm (Ultimate)",
    "Stranger",
    "Strong Guy",
    "Stryfe",
    "Stryfe (Ultimate)",
    "Sub-Mariner",
    "Sue Storm",
    "Sugar Man",
    "Sumo",
    "Sunfire",
    "Sunfire (Age of Apocalypse)",
    "Sunset Bain",
    "Sunspot",
    "Super Hero Squad",
    "Super-Adaptoid",
    "Super-Skrull",
    "Supernaut",
    "Supreme Intelligence",
    "Surge",
    "Surtur",
    "Susan Delgado",
    "Swarm",
    "Sway",
    "Switch",
    "Sword Master (Sword Master)",
    "Swordsman",
    "Swordsman (Jacques Duquesne)",
    "Sym",
    "Synch",
    "T'Challa",
    "Tag",
    "Talisman (Elizabeth Twoyoungmen)",
    "Talkback (Chase Stein)",
    "Talon (Fraternity of Raptors)",
    "Talos",
    "Tana Nile",
    "Tarantula (Luis Alvarez)",
    "Tarantula (Maria Vasquez)",
    "Tarot",
    "Taskmaster",
    "Tattoo",
    "Taurus (Cornelius van Lunt)",
    "Technarchy",
    "Ted Forrester",
    "Tempest",
    "Tenebrous",
    "Terrax",
    "Terror",
    "Texas Twister",
    "Thaddeus Ross",
    "Thanos",
    "Thanos (Ultimate)",
    "The 198",
    "The Anarchist",
    "The Call",
    "The Captain",
    "The Collector (Taneleer Tivan)",
    "The Enforcers",
    "The Executioner",
    "The Fallen",
    "The Fury",
    "The Hand",
    "The Hood",
    "The Howling Commandos",
    "The Hunter",
    "The Initiative",
    "The Leader (HAS)",
    "The Liberteens",
    "The Liberty Legion",
    "The Order",
    "The Phantom",
    "The Professor",
    "The Renegades",
    "The Santerians",
    "The Shiver Man",
    "The Spike",
    "The Stranger",
    "The Twelve",
    "The Watchers",
    "Thena",
    "Thing",
    "Thing (Marvel Heroes)",
    "Thing (Ultimate)",
    "Thor",
    "Thor (Goddess of Thunder)",
    "Thor (MAA)",
    "Thor (Marvel Heroes)",
    "Thor (Marvel War of Heroes)",
    "Thor (Marvel: Avengers Alliance)",
    "Thor (Ultimate)",
    "Thor Girl",
    "Thunderball",
    "Thunderbird (John Proudstar)",
    "Thunderbird (Neal Shaara)",
    "Thunderbolt (Bill Carver)",
    "Thunderbolt Ross",
    "Thunderbolts",
    "Thundra",
    "Tiger Shark",
    "Tiger's Beautiful Daughter",
    "Tigra (Greer Nelson)",
    "Timeslip",
    "Tinkerer",
    "Tippy Toe",
    "Titania",
    "Titanium Man (Topolov)",
    "Toad",
    "Toad Men",
    "Tomas",
    "Tombstone",
    "Tomorrow Man",
    "Tony Stark",
    "Toro (Thomas Raymond)",
    "Toxin",
    "Toxin (Eddie Brock)",
    "Trauma",
    "Trevor Fitzroy",
    "Triathlon",
    "Trish Tilby",
    "Triton",
    "True Believers",
    "Turbo",
    "Tusk",
    "Two-Gun Kid",
    "Tyger Tiger",
    "Typhoid Mary",
    "Tyrannus",
    "U-Foes",
    "U-Go Girl",
    "U.S. Agent",
    "Uatu The Watcher",
    "Ulik",
    "Ultimate Spider-Man (USM)",
    "Ultimates",
    "Ultimatum",
    "Ultimo",
    "Ultra-Adaptoid",
    "Ultragirl (Earth-93060)",
    "Ultron",
    "Umar",
    "Unicorn",
    "Union Jack (Brian Falsworth)",
    "Union Jack (Joseph Chapman)",
    "Union Jack (Montgomery Falsworth)",
    "Unus",
    "Unus (Age of Apocalypse)",
    "Unus (House of M)",
    "Unus (Ultimate)",
    "Valeria Richards",
    "Valkyrie (Exiles)",
    "Valkyrie (Samantha Parrington)",
    "Valkyrie (Ultimate)",
    "Vampiro",
    "Vance Astro",
    "Vanisher (Age of Apocalypse)",
    "Vanisher (Telford Porter)",
    "Vanisher (Ultimate)",
    "Vapor",
    "Vargas",
    "Vector",
    "Veda",
    "Vengeance (Michael Badilino)",
    "Venom (Flash Thompson)",
    "Venom (Mac Gargan)",
    "Venom (Ultimate)",
    "Venus (Siren)",
    "Venus Dee Milo",
    "Vermin (Edward Whelan)",
    "Vertigo (Savage Land Mutate)",
    "Victor Mancha",
    "Victor Von Doom",
    "Vin Gonzales",
    "Vindicator",
    "Violations",
    "Viper",
    "Virginia Dare",
    "Vision",
    "Vivisector",
    "Vulcan (Gabriel Summers)",
    "Vulture (Adrian Toomes)",
    "Vulture (Blackie Drago)",
    "Wallflower",
    "Wallop",
    "Wallow",
    "War (Abraham Kieros)",
    "War Machine (Iron Man 3 - The Official Game)",
    "War Machine (James Rhodes)",
    "War Machine (Marvel: Avengers Alliance)",
    "War Machine (Parnell Jacobs)",
    "War Machine (Ultimate)",
    "Warbird",
    "Warbound",
    "Warhawk (Mitchell Tanner)",
    "Warlock (Janie Chin)",
    "Warlock (Technarchy)",
    "Warpath",
    "Warren Worthington III",
    "Warstar",
    "Wasp",
    "Wasp (Ultimate)",
    "Wave (Wave)",
    "Weapon Omega",
    "Weapon X",
    "Wendell Rand",
    "Wendell Vaughn",
    "Wendigo",
    "Werewolf By Night",
    "Whiplash (Anton Vanko)",
    "Whiplash (Mark Scarlotti)",
    "Whirlwind",
    "Whistler",
    "White Queen (Adrienne Frost)",
    "White Tiger (Angela Del Toro)",
    "White Tiger (USM)",
    "Whizzer (Stanley Stewart)",
    "Wiccan",
    "Wild Child",
    "Wild Child (Age of Apocalypse)",
    "Wild Pack",
    "Wildside",
    "William Stryker",
    "Wilson Fisk",
    "Wind Dancer",
    "Winter Soldier",
    "Wither",
    "Wolf Cub",
    "Wolfpack",
    "Wolfsbane",
    "Wolfsbane (Age of Apocalypse)",
    "Wolver-dok",
    "Wolverine",
    "Wolverine (LEGO Marvel Super Heroes)",
    "Wolverine (Marvel War of Heroes)",
    "Wolverine (Ultimate)",
    "Wolverine (X-Men: Battle of the Atom)",
    "Wonder Man",
    "Wong",
    "Wong (Ultimate)",
    "Wraith",
    "Wrecker",
    "Wrecking Crew",
    "X-23",
    "X-51",
    "X-Babies",
    "X-Cutioner",
    "X-Factor",
    "X-Factor Investigations",
    "X-Force",
    "X-Man",
    "X-Men",
    "X-Men (Ultimate)",
    "X-Ray (James Darnell)",
    "X-Statix",
    "X.S.E.",
    "Xavin",
    "Xorn (Kuan-Yin Xorn)",
    "Yellow Claw",
    "Yellowjacket (Hank Pym)",
    "Yellowjacket (Rita DeMara)",
    "Yondu",
    "Young Avengers",
    "Young X-Men",
    "Zaladane",
    "Zaran",
    "Zarda",
    "Zarek",
    "Zeigeist",
    "Zemo",
    "Zeus",
    "Zodiak",
    "Zombie (Simon Garth)",
    "Zuras",
    "Zzzax"
];
var inputFormEl = document.getElementById('inputForm');
var favorites = [];
var showFavoritesBtn = document.getElementById('showFavorites');

//Give suggestions for auto complete
function autoComplete(searchInputEl, names){
    // console.log(names);
    var currentFoucs;
    searchInputEl.addEventListener('input', function(event){
        var a, b, i, val = this.value;
        
        closeAllLists();
        if (!val){return false;}
        currentFoucs = -1;

        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(a);
        for(i = 0; i < names.length; i++){
            if (names[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){
                b = document.createElement('div');
                //used for making the matching letters bold
                b.innerHTML = '<strong>' + names[i].substr(0, val.length) + '</strong>';
                b.innerHTML += names[i].substr(val.length);
                // it will hold the current array item value
                b.innerHTML += '<input type="hidden" value="' + names[i] + '">';
                b.addEventListener('click', function(event){
                    // insert the element to the input element
                    // for autocomplete text field
                    searchInputEl.value = this.getElementsByTagName('input')[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    searchInputEl.addEventListener('keydown', function(event){
        var x = document.getElementById(this.id + 'autocomplete-list');
        if (x){
            x = x.getElementsByTagName('div');
        }
        if (event.key == 'ArrowDown'){
            // if down arrow key is pressed,
            // increase the current foucs variable
            currentFoucs++;
            addActive(x);// used to make the variable more visible
        }
        else if (event.key == 'ArrowUp'){
            // if up arrow key is pressed,
            // decrease the current foucs variable
            currentFoucs--;
            addActive(x);
        }
        else if (event.key == 'Enter'){
            event.preventDefault();
            closeAllLists(x);
            if (currentFoucs > -1){
                if (x){
                    // for that particular input element emulate 
                    // mouse click
                    x[currentFoucs].click();
                }
            }
        }
    });
    function addActive(x){
        //function to identify an item as active
        if (!x){
            return false;
        }
        // remove all the active class on all items
        removeActive(x);
        if (currentFoucs >= x.length) {
            currentFoucs = 0;
        }
        if (currentFoucs < 0){
            currentFoucs = (x.length - 1);
        }
        // add class 'auto-complete-active'
        x[currentFoucs].classList.add('autocomplete-active');    
    }
    function removeActive(x){
        for (var i = 0; i < x.length; i++){
            x[i].classList.remove('autocomplete-active');
        }
    }
    function closeAllLists(element){
        //close all autocomplete lists in the document
        //except the one passed as an argument
        var x = document.getElementsByClassName('autocomplete-items');
        for (var i=0; i <x.length; i++){
            if (element != x[i] && element != searchInputEl){
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    
    document.addEventListener('click', function(event){
        // this sends the element present at the position
        // we click in the document

        closeAllLists(event.target);
    })
    searchInputEl.addEventListener('keydown', function(event){
        if(event.key='Enter'){
            closeAllLists(event.target);
        }
    })

}
autoComplete(searchInputEl, names);

//Display Detailed Hero Page
function detailsPage(character){
    var detailedPageEl = document.getElementById('detailedPage');
    var appEl = document.getElementById('app');
    appEl.classList.add('hide-content')
    detailedPageEl.classList.remove('hide-content');
    detailedPageEl.innerHTML = '';
    //back button
    var backBtn = document.createElement('button');
    backBtn.setAttribute('class', 'back-btn');
    backBtn.innerHTML = '&lt;&nbsp;Back';
    detailedPageEl.appendChild(backBtn);

    // Event listener
    // when back button is clicked we go back to search page
    backBtn.addEventListener('click', function(){
        appEl.classList.remove('hide-content');
        detailedPageEl.innerHTML = '';
        detailedPageEl.classList.add('hide-content');
    })

    //Title of the detail page
    var title = document.createElement('h2');
    title.classList.add('detail-heading');
    title.innerHTML = character.name;
    detailedPageEl.appendChild(title);

    //main body of the hero details
    var mainEl = document.createElement('main');
    mainEl.classList.add('detail-body');
    detailedPageEl.appendChild(mainEl);

    // add image in main element
    var detailedImage = document.createElement('img');
    var url = character.thumbnail.path + '.' + character.thumbnail.extension;
    detailedImage.setAttribute('src', url);
    detailedImage.setAttribute('class', 'detail-img');
    mainEl.appendChild(detailedImage);

    // add another container that conatiner data
    var infoContainer = document.createElement('div');
    infoContainer.setAttribute('class','detail-info-container');
    mainEl.appendChild(infoContainer);

    // add description if it is present
    if (character.description.length != 0){
        var descriptionEl = document.createElement('p');
        var spanEl = document.createElement('span');
        spanEl.classList.add('detail-side-heading');
        spanEl.innerHTML = 'Description:';
        descriptionEl.classList.add('detail-description')
        descriptionEl.appendChild(spanEl);
        var brEl = document.createElement('br');
        descriptionEl.appendChild(brEl);
        descriptionEl.innerHTML = character.description;
        infoContainer.appendChild(descriptionEl);
    }

    // list container
    var listContainerEl = document.createElement('div');
    listContainerEl.setAttribute('class','detail-list-container');
    infoContainer.appendChild(listContainerEl);

    //creatinglists
    // 1. comics
    var comicsList = document.createElement('ul');
    comicsList.classList.add('detail-description');
    listContainerEl.appendChild(comicsList);
    var c = document.createElement('li');
    c.innerHTML = 'Comics:';
    c.classList.add('detail-side-heading');
    comicsList.appendChild(c);
    //run a loop to append the list items
    for (var item of character.comics.items){
        let listItem = document.createElement('li');
        listItem.innerHTML = item.name;
        comicsList.appendChild(listItem); 
    }
    
    //2. series
    var seriesList = document.createElement('ul');
    seriesList.classList.add('detail-description');
    listContainerEl.appendChild(seriesList);
    var d = document.createElement('li');
    d.innerHTML = 'Series:';
    d.classList.add('detail-side-heading');
    seriesList.appendChild(d);
    //run a loop to append the list items
    for (var item of character.series.items){
        let listItem = document.createElement('li');
        listItem.innerHTML = item.name;
        seriesList.appendChild(listItem); 
    }

    // 3.stories
    var storiesList = document.createElement('ul');
    storiesList.classList.add('detail-description');
    listContainerEl.appendChild(storiesList);
    var e = document.createElement('li');
    e.innerHTML = 'Stories:';
    e.classList.add('detail-side-heading');
    storiesList.appendChild(e);
    //run a loop to append the list items
    for (var item of character.stories.items){
        let listItem = document.createElement('li');
        listItem.innerHTML = item.name;
        storiesList.appendChild(listItem); 
    }

}

function displayFavorites(){
    var favorites = sessionStorage.getItem('favorites');
    favorites = JSON.parse(favorites);
    display.innerHTML  = '';
    searchInputEl.value = '';
    var topContainer = document.createElement('div');
    topContainer.classList.add('top-container')
    display.appendChild(topContainer);

    var backBtn = document.createElement('button');
    backBtn.setAttribute('class', 'back-btn');
    backBtn.innerHTML = '&lt;&nbsp;Back';
    topContainer.appendChild(backBtn);

    backBtn.addEventListener('click',function(){
        display.innerHTML = '';
        searchInputEl.value = '';
    })
    
    //favorites heading
    var heading = document.createElement('h2');
    heading.classList.add('detail-heading', 'fav-heading');
    heading.innerHTML = 'Favorites';
    topContainer.appendChild(heading);

    var wrapContainer = document.createElement('div');
    wrapContainer.classList.add('display');
    display.appendChild(wrapContainer);
    for(let character of favorites){
        var divEl = document.createElement('DIV');
        divEl.setAttribute('class', 'card');
        wrapContainer.appendChild(divEl);
            
        // display the result thumbnail
        var thumbnailImg = document.createElement('img');
        var imageLink = character.thumbnail.path + '.' + character.thumbnail.extension;
        thumbnailImg.setAttribute('src', imageLink);
        thumbnailImg.setAttribute('class', 'result-image');
        divEl.appendChild(thumbnailImg);
        
        thumbnailImg.addEventListener('click',function(){
            detailsPage(character);
        })
        //card data that contains super hero name and favorite icon
        var dataDiv = document.createElement('div');
        dataDiv.setAttribute('class', 'card-data');
        divEl.appendChild(dataDiv);

        //create element for super hero name
        var namePara = document.createElement('p');
        namePara.innerHTML = character.name;
        namePara.setAttribute('class', 'hero-name');
        dataDiv.appendChild(namePara);

        //add to favorites button
        var favBtn = document.createElement('button');
        favBtn.setAttribute('class','add-to-favorites');
        var icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-trash');
        favBtn.appendChild(icon);
        dataDiv.appendChild(favBtn);
        
        favBtn.addEventListener('click', function(){
            favorites = favorites.filter(function(element){
                if(element.name !== character.name){
                    return element
                }
            });

            sessionStorage.setItem('favorites', JSON.stringify(favorites));
            showFavoritesBtn.click();
            console.log('favorites: ', favorites);
        })
    }

}

showFavoritesBtn.addEventListener('click', displayFavorites);
//Display Search Results
function displayResults(characterResults){
    display.innerHTML='';
    var inputValue = searchInputEl.value;
    // console.log(characterResults);

    
    var searchResults = characterResults.filter(function(character){
        if (character.name.substr(0,inputValue.length).toLowerCase() == inputValue.toLowerCase()){
            return character;
        }
    });
    for(let character of searchResults){
        var divEl = document.createElement('DIV');
        divEl.setAttribute('class', 'card');
        display.appendChild(divEl);
            
        // display the result thumbnail
        var thumbnailImg = document.createElement('img');
        var imageLink = character.thumbnail.path + '.' + character.thumbnail.extension;
        thumbnailImg.setAttribute('src', imageLink);
        thumbnailImg.setAttribute('class', 'result-image');
        divEl.appendChild(thumbnailImg);
        
        thumbnailImg.addEventListener('click',function(){
            detailsPage(character);
        })
        //card data that contains super hero name and favorite icon
        var dataDiv = document.createElement('div');
        dataDiv.setAttribute('class', 'card-data');
        divEl.appendChild(dataDiv);

        //create element for super hero name
        var namePara = document.createElement('p');
        namePara.innerHTML = character.name;
        namePara.setAttribute('class', 'hero-name');
        dataDiv.appendChild(namePara);

        //add to favorites button
        var favBtn = document.createElement('button');
        favBtn.setAttribute('class','add-to-favorites');
        favBtn.innerHTML = 'Add';
        var icon = document.createElement('i');
        icon.classList.add('fa-solid', 'fa-heart');
        favBtn.appendChild(icon);
        dataDiv.appendChild(favBtn);
        
        favBtn.addEventListener('click', function(){

            function containsObject(obj, favorites) {
                var i;
                for (i = 0; i < favorites.length; i++) {
                    if (favorites[i] === obj) {
                        return true;
                    }
                }
                return false;
            }
            let flag = containsObject(character,favorites);
            if (flag){
                alert('Already present in Favorites');
            }
            else{
                favorites.push(character)
                sessionStorage.setItem('favorites', JSON.stringify(favorites));
            }
            
        })
    }
}


// Run at the start of the loading so that data is downloaded
async function getData(){
    var options = {
        method: 'GET'
    };
    var characterResults = [];
    console.log('start getting data') 
    display.innerHTML = 'Please wait until the data is fetched.....';   
    // set 1 keys
    // var privateKey = '3055d648a17ed27ef6970c32418c2bbd3cc04de0';
    // var publicKey = 'aa3f6970a3b07e177aaa208caa8ad812';
    var privateKey = '5cda6b0037703b5b68518f92ea429a7b38046983';
    var publicKey = '83d58875b03671ff384eadebac52bb2e';
    var hash = MD5('1' + privateKey + publicKey).toString();
    
    for (let i = 0; i < 1563; i = i + 100){
        // console.log(i);
    
        var requestUrl = 'https://gateway.marvel.com/v1/public/characters?ts=' + '1' + '&apikey=' + publicKey + '&hash=' + hash + '&limit=100' + '&offset=' + i;
        var temp = await fetch(requestUrl, options).then(function(response){
            return response.json();
        })
        .then(function(jsonData){
            return jsonData.data.results
        })
        characterResults = [...characterResults, ...temp];
    }
    
    console.log('results acquired')
    display.innerHTML = '';
    
    searchInputEl.addEventListener('keydown',function(event){
        if (event.key =='Enter'){
            displayResults(characterResults);
        }
    }); 
    inputFormEl.addEventListener('keydown',function(event){
        if(event.key =='Enter'){
            displayResults(characterResults);
        }
    })
    // console.log(characterResults);
}

getData();

