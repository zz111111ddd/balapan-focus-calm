/* ==========================================================
   Quiz, story templates, buddies, habits, movement breaks.
   All copy is plain-language parenting support — no medical
   claims, no diagnosis.
   ========================================================== */
var BF = window.BF = window.BF || {};

BF.INTERESTS = {
  space:    { label:"Space & rockets",  buddy:"Pip the little rocket",   world:"the Moon Road",       power:"count down from five like a rocket" },
  dinos:    { label:"Dinosaurs",        buddy:"Moss the tiny dinosaur",  world:"Fern Valley",         power:"stomp slowly like a big, calm dinosaur" },
  animals:  { label:"Animals",          buddy:"Juniper the fox",         world:"the Quiet Woods",     power:"stretch tall like a giraffe" },
  trains:   { label:"Trains & cars",    buddy:"Tock the little train",   world:"Station Hill",        power:"go chug-chug, one car at a time" },
  ocean:    { label:"The ocean",        buddy:"Wren the sea turtle",     world:"Shell Bay",           power:"breathe like slow waves" },
  building: { label:"Building & robots",buddy:"Bolt the helper robot",   world:"Gear Town",           power:"power up one block at a time" },
  drawing:  { label:"Drawing & art",    buddy:"Doodle the pencil",       world:"Paper Hills",         power:"draw the feeling, then fold it away" },
  sports:   { label:"Ball games",       buddy:"Kick the bouncy ball",    world:"Meadow Field",        power:"bounce, breathe, and aim" }
};

BF.QUIZ = [
  { id:"child", kind:"child", title:"Who are we making this for?", sub:"Just a first name or nickname. It stays on this device." },
  { id:"profile", kind:"single", title:"What feels closest to your child right now?",
    sub:"No diagnosis needed. Pick what you notice most at home.",
    options:[
      {v:"anxiety", t:"Worry & fears", d:"Avoids new things, needs lots of reassurance, tummy aches before events"},
      {v:"adhd", t:"Focus & starting", d:"Hard to start, easily pulled away, mornings and homework are battles"},
      {v:"both", t:"Both, honestly", d:"Worry AND trouble focusing — they feed each other"},
      {v:"unsure", t:"Not sure yet", d:"Something is hard and I want a gentle place to start"}
    ]},
  { kind:"cheer", title:"You're already doing the hard part.", text:"Noticing what's hard — without blaming your child or yourself — is where every good plan starts. Many parents juggle worry and focus struggles in the same child; you're not the only one." },
  { id:"hard", kind:"multi", title:"When is it hardest?", sub:"Choose all that apply. We'll start with these.",
    options:[
      {v:"mornings",t:"Mornings"},{v:"homework",t:"Homework"},{v:"bedtime",t:"Bedtime"},{v:"separation",t:"Saying goodbye"},
      {v:"new",t:"New places & people"},{v:"noise",t:"Noisy places"},{v:"doctor",t:"Doctor & dentist"},{v:"transitions",t:"Stopping one thing for another"},
      {v:"waiting",t:"Waiting"},{v:"losing",t:"Losing & mistakes"}
    ]},
  { id:"reactions", kind:"multi", title:"What does it look like?", sub:"How your child usually reacts in those moments.",
    options:[
      {v:"avoid",t:"Refuses or avoids"},{v:"reassure",t:"Asks “what if…” again and again"},{v:"meltdown",t:"Big meltdowns"},
      {v:"freeze",t:"Freezes or goes quiet"},{v:"wander",t:"Drifts off, forgets the task"},{v:"rush",t:"Rushes, can't wait"},{v:"body",t:"Tummy aches, headaches"}
    ]},
  { id:"interest", kind:"single", title:"What does your child love?", sub:"Their buddy and story world will be built around it.",
    options: Object.keys(BF.INTERESTS).map(function(k){ return {v:k, t:BF.INTERESTS[k].label}; }) },
  { kind:"cheer", title:"Their story is taking shape.", text:"Kids lean in when they are the hero. Next, a couple of honest questions about what we parents try — the stuff that's totally understandable, but sometimes keeps the worry going." },
  { id:"tries", kind:"multi", title:"What do you usually try?", sub:"No judgement. Every loving parent does some of these.",
    options:[
      {v:"reassure",t:"Reassure: “nothing bad will happen”"},{v:"avoid",t:"Skip the hard thing to keep the peace"},{v:"doit",t:"Do it for them to save time"},
      {v:"repeat",t:"Repeat the instruction many times"},{v:"threat",t:"Warn about consequences"},{v:"screen",t:"Use a screen to calm things down"}
    ]},
  { id:"flags", kind:"multi", title:"Safety check", sub:"Have you noticed any of these lately? This only changes our advice to you — it is not a diagnosis.",
    options:[
      {v:"selfharm",t:"Talks about hurting themselves or not wanting to live"},{v:"weeks",t:"Can't sleep or eat for weeks"},
      {v:"panic",t:"Panic attacks most days"},{v:"school",t:"Has stopped going to school"},{v:"danger",t:"Hurts others or is in danger"},{v:"none",t:"None of these", exclusive:true}
    ]}
];

/* Habits to drop -> what to do instead (shown in plan + Brave Plan) */
BF.HABITS = {
  reassure:{ drop:"Endless reassurance (“nothing bad will happen”)", instead:"Say it once, then show confidence: “You can handle this.”" },
  avoid:{ drop:"Skipping the hard thing to keep the peace", instead:"Shrink the step instead of skipping it." },
  doit:{ drop:"Doing it for them to save time", instead:"Do the first 10% together, then step back." },
  repeat:{ drop:"Repeating the instruction again and again", instead:"Say it once, show the step card, point — no words." },
  threat:{ drop:"Warning about consequences in the moment", instead:"Name what they did right, out loud, as soon as you see it." },
  screen:{ drop:"Screens as the main calm-down tool", instead:"Try 3 balloon breaths or a 60-second movement break first." }
};

BF.FEELINGS = ["wobbly","fluttery","tight","buzzy","fizzy"];

/* Story templates. {name} {they} {them} {their} {They} {buddy} {world} {power} {event} {feel} {step1}…{step5} */
BF.STORY = {
  open:[
    "This is {name}. {name} lives near {world} and loves it there. {Their} best buddy is {buddy}.",
    "Every hero has a home base. {name}'s is {world}, where {buddy} is always nearby."
  ],
  anxiety:[
    "One day {name} found out that soon {they} would {event}. {Their} tummy went {feel}. That's the brave feeling — it shows up when something new is coming.",
    "{buddy} said: “Feelings are like waves. They get big… and then they get small again. You don't have to make them go away.”",
    "So they made a ladder. Not one giant jump — five small steps. The first one was: {step1}.",
    "When the feeling got big, {name} remembered {their} trick: {power}. And {they} took the next step anyway.",
    "Step by step, {name} climbed. Maybe it wasn't perfect. But it was brave — and brave is what counts."
  ],
  adhd:[
    "{name} has a busy, bright brain — full of ideas, like {world} on a sunny day. Sometimes it zooms right past the thing {they} need to do.",
    "Today the mission was to {event}. {buddy} had a plan: “We don't do it all at once. We do ONE card, then tap Done.”",
    "First card: {step1}. The timer was a slow little circle. {name} watched it and kept going.",
    "Halfway there, it was time to move! {name} did a quick wiggle break, then came right back.",
    "Card by card, the mission was done. {buddy} cheered: “You did each step — that's how big things get done!”"
  ],
  both:[
    "{name} has a big heart and a busy brain. Sometimes worry and wiggles show up at the same time — and that's okay.",
    "Soon {name} would {event}. {Their} tummy went {feel}, and {their} thoughts started zooming in every direction.",
    "{buddy} said: “Let's slow it all down. One breath. One step. One card at a time.” The first step was: {step1}.",
    "When it got loud inside, {name} used {their} trick: {power}. Then {they} looked at the next card — just one.",
    "Step by step, breath by breath, {name} did it. Worry came along for the ride, but {name} was the one driving."
  ],
  close:"The end — and the beginning of {name}'s brave ladder."
};

/* 60-second movement breaks for Routine Quest */
BF.MOVES = [
  { t:"Giraffe stretch", d:"Reach up tall, slowly, for 5 counts. Then flop down like a rag doll.", anim:"stretch" },
  { t:"Frog hops", d:"Five slow frog hops. Land soft, like a feather.", anim:"hop" },
  { t:"Tree pose", d:"Stand on one foot like a tree in the wind. Switch feet.", anim:"sway" },
  { t:"Wall push", d:"Push the wall like it's very heavy, for 10 counts. Then shake it out.", anim:"push" }
];

BF.RED_FLAGS = ["selfharm","weeks","panic","school","danger"];
