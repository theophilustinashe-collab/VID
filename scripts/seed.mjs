import { db, questionsTable, roadSignsTable } from '../lib/db/src/index.ts';

async function seed() {
  console.log("🌱 Seeding database...");

  const questions = [
    {
      text: "When should you use your hooter in a built-up area?",
      options: ["To greet friends", "Only to avoid an accident", "To get people out of your way", "When you are angry"],
      correctAnswer: 1,
      category: "Rules",
      difficulty: "easy",
      explanation: "In built-up areas, the hooter should only be used as a warning to avoid a potential collision or accident.",
    },
    {
      text: "What is the general speed limit for a light motor vehicle on a wide tarred road in Zimbabwe?",
      options: ["80 km/h", "100 km/h", "120 km/h", "60 km/h"],
      correctAnswer: 2,
      category: "Rules",
      difficulty: "medium",
      explanation: "On wide tarred roads (highways), the general speed limit for light motor vehicles is 120 km/h unless otherwise stated.",
    },
    {
      text: "What does a solid white line in the middle of the road mean?",
      options: ["You may overtake", "Overtaking is permitted if clear", "You must not cross or straddle the line", "Parking is allowed"],
      correctAnswer: 2,
      category: "Road Markings",
      difficulty: "easy",
      explanation: "A solid white line indicates that you must not cross or straddle it, usually because it's dangerous to overtake there.",
    },
    {
      text: "At an uncontrolled intersection, who has the right of way?",
      options: ["The faster vehicle", "The vehicle on the right", "The vehicle on the left", "The larger vehicle"],
      correctAnswer: 1,
      category: "Intersections",
      difficulty: "medium",
      explanation: "In Zimbabwe, at an uncontrolled intersection, you must give way to traffic approaching from your right.",
    },
    {
      text: "When are you allowed to drive on the right-hand side of a road with two-way traffic?",
      options: ["When you are in a hurry", "To overtake when it is safe to do so", "Never", "When the road is empty"],
      correctAnswer: 1,
      category: "Rules",
      difficulty: "easy",
      explanation: "You may drive on the right side only for the purpose of overtaking, and only when it is safe and legal to do so.",
    },
    {
      text: "What is the meaning of a flashing red robot (traffic light)?",
      options: ["Proceed with caution", "Stop and then proceed when safe", "Stop and wait for it to turn green", "Yield to all traffic"],
      correctAnswer: 1,
      category: "Traffic Lights",
      difficulty: "medium",
      explanation: "A flashing red robot is treated like a four-way stop. You must stop completely and proceed only when it is safe.",
    },
    {
      text: "What should you do if your vehicle breaks down at night?",
      options: ["Leave it and walk for help", "Turn on hazard lights and place reflectors", "Wait inside until morning", "Set the car on fire"],
      correctAnswer: 1,
      category: "Emergency",
      difficulty: "easy",
      explanation: "You must use hazard lights and place warning triangles (reflectors) at least 30-50 meters behind and in front of the vehicle.",
    },
    {
      text: "How far from a corner are you allowed to park?",
      options: ["2 meters", "5 meters", "7.5 meters", "10 meters"],
      correctAnswer: 2,
      category: "Parking",
      difficulty: "hard",
      explanation: "Parking is generally prohibited within 7.5 meters of an intersection or corner.",
    },
    {
      text: "What is the 'Two-Second Rule' used for?",
      options: ["To cross an intersection", "To maintain a safe following distance", "To change gears", "To start the engine"],
      correctAnswer: 1,
      category: "General Rules",
      difficulty: "medium",
      explanation: "The two-second rule helps drivers maintain a safe distance between their car and the vehicle in front, regardless of speed.",
    },
    {
      text: "A continuous yellow line on the left side of the road means?",
      options: ["No parking allowed", "No stopping at any time", "Overtaking zone", "Emergency lane"],
      correctAnswer: 1,
      category: "Road Markings",
      difficulty: "medium",
      explanation: "A continuous yellow line on the edge of the road signifies that no stopping or parking is allowed at any time.",
    },
    {
      text: "What is the maximum speed limit in a built-up area (city/town)?",
      options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
      correctAnswer: 1,
      category: "Rules",
      difficulty: "easy",
      explanation: "The general speed limit in built-up areas is 60 km/h unless otherwise posted.",
    },
    {
      text: "What does a stationary green arrow on a traffic light mean?",
      options: ["Stop", "Yield", "Proceed in the direction of the arrow", "Wait for the main light to turn green"],
      correctAnswer: 2,
      category: "Traffic Lights",
      difficulty: "easy",
      explanation: "A green arrow means you may proceed in that direction, even if the main light is red.",
    },
    {
      text: "When meeting a vehicle at night with bright lights, you should?",
      options: ["Switch on your high beams", "Look slightly to the left edge of the road", "Close your eyes", "Stop immediately"],
      correctAnswer: 1,
      category: "Safety",
      difficulty: "medium",
      explanation: "To avoid being blinded, you should look toward the left edge of the road to guide your path.",
    },
    {
      text: "Which side must you overtake another vehicle on a standard road?",
      options: ["The right side", "The left side", "Either side", "The side with more space"],
      correctAnswer: 0,
      category: "Rules",
      difficulty: "easy",
      explanation: "In Zimbabwe, you must always overtake on the right side of the vehicle in front.",
    },
    {
      text: "What is the primary rule of the road in Zimbabwe?",
      options: ["Drive on the right", "Drive on the left", "Fastest car goes first", "Large vehicles have right of way"],
      correctAnswer: 1,
      category: "Rules",
      difficulty: "easy",
      explanation: "Zimbabwe follows the British system where vehicles drive on the left side of the road.",
    },
    {
      text: "A red triangle sign with its apex pointing down means?",
      options: ["Stop", "Yield / Give Way", "Danger", "No Entry"],
      correctAnswer: 1,
      category: "Signs",
      difficulty: "easy",
      explanation: "An inverted red triangle is the international symbol for 'Give Way'.",
    },
    {
      text: "When driving in heavy rain, you should?",
      options: ["Speed up to get home faster", "Turn on hazard lights and slow down", "Turn on headlights and increase following distance", "Stop in the middle of the road"],
      correctAnswer: 2,
      category: "Safety",
      difficulty: "medium",
      explanation: "Rain reduces visibility and traction. Using headlights and increasing distance helps prevent accidents.",
    },
    {
      text: "What is the legal blood alcohol limit for drivers in Zimbabwe?",
      options: ["0.00%", "0.05%", "0.08%", "0.10%"],
      correctAnswer: 2,
      category: "Legal",
      difficulty: "hard",
      explanation: "The legal limit is 0.08g per 100ml of blood.",
    },
    {
      text: "What does it mean if a policeman extends his arm horizontally toward you?",
      options: ["Proceed", "Slow down", "Stop", "Turn left"],
      correctAnswer: 2,
      category: "Signals",
      difficulty: "medium",
      explanation: "A policeman's arm held out horizontally means traffic approaching from that direction must stop.",
    },
    {
      text: "You may not overtake another vehicle when?",
      options: ["Approaching a blind rise or curve", "On a one-way street", "In a 60km/h zone", "The car in front is slow"],
      correctAnswer: 0,
      category: "Rules",
      difficulty: "easy",
      explanation: "Overtaking on a blind rise or curve is extremely dangerous as you cannot see oncoming traffic.",
    },
    {
      text: "A blue circular sign generally indicates?",
      options: ["Danger", "A prohibition", "A mandatory instruction", "General information"],
      correctAnswer: 2,
      category: "Signs",
      difficulty: "medium",
      explanation: "Blue circular signs are used for mandatory actions, such as 'Turn Left Only' or 'Bicycles Only'.",
    },
    {
      text: "What must you do at a 'Stop' sign if there is no other traffic?",
      options: ["Slow down and proceed", "Come to a complete stop", "Proceed at normal speed", "Flash your lights"],
      correctAnswer: 1,
      category: "Rules",
      difficulty: "easy",
      explanation: "A stop sign always requires a complete cessation of movement, regardless of traffic conditions.",
    },
    {
      text: "A broken white line on the road means?",
      options: ["No overtaking", "Overtaking permitted if safe", "Parking allowed", "One-way street only"],
      correctAnswer: 1,
      category: "Road Markings",
      difficulty: "easy",
      explanation: "Broken white lines indicate that you may cross them to overtake when it is safe to do so.",
    },
    {
      text: "When entering a roundabout, you must give way to?",
      options: ["Traffic from the left", "Traffic already in the roundabout (from the right)", "No one", "Pedestrians only"],
      correctAnswer: 1,
      category: "Intersections",
      difficulty: "medium",
      explanation: "Traffic entering a roundabout must yield to vehicles already circulating inside from the right.",
    },
    {
      text: "What is the minimum age to obtain a Class 4 driver's licence in Zimbabwe?",
      options: ["16 years", "17 years", "18 years", "21 years"],
      correctAnswer: 0,
      category: "Legal",
      difficulty: "medium",
      explanation: "In Zimbabwe, the minimum age for a Class 4 (light motor vehicle) licence is 16 years.",
    }
  ];

  const signs = [
    {
      name: "Stop Sign",
      category: "regulatory",
      meaning: "You must bring your vehicle to a complete stop and give way to all traffic.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Stop_sign.svg/1200px-Stop_sign.svg.png",
      usage: "Placed at intersections where a full stop is mandatory for safety.",
    },
    {
      name: "Give Way",
      category: "regulatory",
      meaning: "Slow down and prepare to stop to give way to traffic on the major road.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Yield_sign.svg/1200px-Yield_sign.svg.png",
      usage: "Commonly found at T-junctions or roundabouts.",
    },
    {
      name: "No Entry",
      category: "regulatory",
      meaning: "Vehicles are prohibited from entering this road.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/No_entry.svg/1200px-No_entry.svg.png",
      usage: "Used to prevent traffic from entering one-way streets in the wrong direction.",
    },
    {
      name: "Speed Limit 60",
      category: "regulatory",
      meaning: "Maximum speed allowed is 60 kilometers per hour.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Speed_limit_60.svg/1200px-Speed_limit_60.svg.png",
      usage: "Commonly used in urban areas and built-up zones.",
    },
    {
      name: "No Overtaking",
      category: "regulatory",
      meaning: "You are not allowed to overtake other vehicles.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/No_overtaking.svg/1200px-No_overtaking.svg.png",
      usage: "Used in areas with poor visibility or narrow roads.",
    },
    {
      name: "Danger Ahead",
      category: "warning",
      meaning: "General warning of danger on the road ahead.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Danger_sign.svg/1200px-Danger_sign.svg.png",
      usage: "Used to alert drivers to unexpected hazards.",
    },
    {
      name: "Sharp Curve Right",
      category: "warning",
      meaning: "The road ahead curves sharply to the right.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Sharp_curve_right.svg/1200px-Sharp_curve_right.svg.png",
      usage: "Warns drivers to slow down for a tight bend.",
    },
    {
      name: "Pedestrian Crossing",
      category: "warning",
      meaning: "A pedestrian crossing is ahead; prepare to stop.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pedestrian_crossing.svg/1200px-Pedestrian_crossing.svg.png",
      usage: "Used near schools, shopping centers, and busy streets.",
    }
  ];

  try {
    console.log("Clearing existing data...");
    await db.delete(questionsTable);
    await db.delete(roadSignsTable);

    console.log("Inserting questions...");
    for (const q of questions) {
      await db.insert(questionsTable).values(q);
    }

    console.log("Inserting signs...");
    for (const s of signs) {
      await db.insert(roadSignsTable).values(s);
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
