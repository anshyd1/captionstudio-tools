/* CaptionStudio Captions Database
   Add captions here in this format:
   { text: "your caption", category: "cat-name", tags: "#tag1 #tag2" }
   
   Categories: cricket, attitude, love, friend, birthday, 
               travel, food, fitness, motivation, funny
*/

const CAPTIONS = [

// CRICKET
{ text: "Khel bada hai, khiladi hum purane 👑", category: "cricket", tags: "#Cricket #IPL2026 #CricketFan" },
{ text: "Cricket = Mera pehla pyaar ❤️🏏", category: "cricket", tags: "#Cricket #CricketLover #IPL" },
{ text: "Score chahe jo ho, swag wahi rahega 😎", category: "cricket", tags: "#Cricket #Attitude #Swag" },
{ text: "Pressure hum par nahi, opponents par 😉", category: "cricket", tags: "#Cricket #Confidence #IPL" },
{ text: "Match jeet liya, dil khush ho gaya! 🏏🏆", category: "cricket", tags: "#Win #Cricket #Victory" },
{ text: "Last ball drama? Bring it on! ⚡", category: "cricket", tags: "#Cricket #LastBall #IPL" },
{ text: "Born to bat, made to win 🏆", category: "cricket", tags: "#Cricketer #Batsman #Winner" },
{ text: "Cricket India me religion hai 🙏", category: "cricket", tags: "#Cricket #India #IPL" },
{ text: "Trophy uthana hamari purani aadat hai 🏆", category: "cricket", tags: "#Champions #Cricket #Trophy" },
{ text: "Stadium ki vibe, dil ki khushi! 🏟️✨", category: "cricket", tags: "#Stadium #IPL #Match" },
{ text: "Maa ki chai + IPL match = Perfect ❤️", category: "cricket", tags: "#IPL #Cricket #Family" },
{ text: "6 chhakke aur trophy hamari 💛", category: "cricket", tags: "#Sixes #Cricket #Trophy" },
{ text: "Cricket > Everything 🏏", category: "cricket", tags: "#Cricket #IPL #Fan" },
{ text: "Aaj toh history ban gayi yaar! 🔥", category: "cricket", tags: "#History #Cricket #IPL" },
{ text: "Yellow jersey, golden moments ✨💛", category: "cricket", tags: "#IPL #Cricket #Yellow" },

// ATTITUDE
{ text: "I don't follow trends, I set them 🔥", category: "attitude", tags: "#Attitude #Boss #SelfMade" },
{ text: "Born to stand out 💎", category: "attitude", tags: "#Attitude #Unique #StandOut" },
{ text: "Self-made, self-paid 💸", category: "attitude", tags: "#SelfMade #Hustle #BossLife" },
{ text: "King of my own world 👑", category: "attitude", tags: "#King #Attitude #Boss" },
{ text: "Mind your business, mine is doing great 📈", category: "attitude", tags: "#Attitude #Success #Boss" },
{ text: "Watch me as I rise 📈", category: "attitude", tags: "#Hustle #Success #Rising" },
{ text: "Quiet ambition, loud results 🎯", category: "attitude", tags: "#Ambition #Success #Results" },
{ text: "Not your average, not your type 😎", category: "attitude", tags: "#Attitude #Unique #Cool" },
{ text: "Built different 💪", category: "attitude", tags: "#BuiltDifferent #Strong #Unique" },
{ text: "Born winner, forever learner 🏆", category: "attitude", tags: "#Winner #Learner #Hustle" },
{ text: "Vibes only, drama never 💯", category: "attitude", tags: "#GoodVibes #Positive #Mindset" },
{ text: "Khud ki kahani, khud ka hero 🦸", category: "attitude", tags: "#SelfMade #Hero #Hindi" },
{ text: "Mehnat karo, kismat banao 💪", category: "attitude", tags: "#Hindi #Hustle #SelfMade" },
{ text: "Hum apni dhun me chalte hain 🎵", category: "attitude", tags: "#Hindi #Attitude #Cool" },
{ text: "Meri jindagi, mere niyam 👑", category: "attitude", tags: "#Hindi #Attitude #Boss" },

// LOVE
{ text: "Tu mera sukoon 💕", category: "love", tags: "#Love #Couple #Soulmate" },
{ text: "Found my forever in you 💍", category: "love", tags: "#Love #Forever #Couple" },
{ text: "You + Me = Always 💖", category: "love", tags: "#Love #Couple #Together" },
{ text: "Tere bina dil khali ❤️", category: "love", tags: "#Love #Hindi #Heart" },
{ text: "Love is in the air ❤️", category: "love", tags: "#Love #Romance #Couple" },
{ text: "Loyal to one, forever 💯", category: "love", tags: "#Love #Loyal #TrueLove" },
{ text: "My favorite person ❤️", category: "love", tags: "#Love #Favorite #Couple" },
{ text: "Pyaar tujhse, dua tere liye 🤲", category: "love", tags: "#Love #Hindi #Pyaar" },
{ text: "Dil ki dhadkan, mera pyaar 💖", category: "love", tags: "#Love #Hindi #Heart" },
{ text: "Heart belongs to you, only you 💓", category: "love", tags: "#Love #Heart #Forever" },
{ text: "Dil se tera, hamesha ke liye ❤️", category: "love", tags: "#Love #Hindi #Pyaar" },
{ text: "Best feeling ever 💕", category: "love", tags: "#Love #Happy #Couple" },

// FRIEND
{ text: "Best friends, best memories 👯", category: "friend", tags: "#Friends #BFF #Squad" },
{ text: "Dosti hai zindagi 🫶", category: "friend", tags: "#Dosti #Friends #Hindi" },
{ text: "Forever squad, no doubt 💕", category: "friend", tags: "#Squad #BFF #Forever" },
{ text: "Friends today, family forever 👨‍👩‍👧", category: "friend", tags: "#Friends #Family #BFF" },
{ text: "My therapist? My friends 😂", category: "friend", tags: "#Friends #Funny #BFF" },
{ text: "Squad goals 💯", category: "friend", tags: "#Squad #Goals #Friends" },
{ text: "BFF for life 👯‍♀️", category: "friend", tags: "#BFF #Friends #Forever" },
{ text: "Hum saath saath hain 🤝", category: "friend", tags: "#Friends #Hindi #Squad" },
{ text: "Dosti me kabhi kami nahi 🥰", category: "friend", tags: "#Dosti #Hindi #BFF" },
{ text: "We are not weird, we are limited edition 💎", category: "friend", tags: "#Friends #Unique #Squad" },

// BIRTHDAY
{ text: "Happy birthday to me! 🎂🎉", category: "birthday", tags: "#HappyBirthday #Bday #BirthdayGirl" },
{ text: "Another year, another adventure ✨", category: "birthday", tags: "#Birthday #Bday #NewYear" },
{ text: "Birthday vibes only 🎈", category: "birthday", tags: "#Birthday #BdayVibes #Celebration" },
{ text: "Born today, slay every day 👑", category: "birthday", tags: "#Birthday #Slay #BdayQueen" },
{ text: "Year older, year better 🌟", category: "birthday", tags: "#Birthday #Growth #Bday" },
{ text: "Birthday girl alert! 🎉💕", category: "birthday", tags: "#BirthdayGirl #Bday #Princess" },
{ text: "Janam din mubarak ho mujhe! 🎂", category: "birthday", tags: "#Birthday #Hindi #Bday" },
{ text: "Born blessed, living blessed 
