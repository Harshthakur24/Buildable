import { progress } from "framer-motion";

const ListContent =[
    {
        text: "AI Superpowers",
        Subtext: "AI + Superlist = 🔮",
        opacity: 1
    },
    {
        text: "Offline mode",
        Subtext: "Keep working, even when your wi-fi isn’t.",
        opacity: 0.91
    },
    {
        text: "Collaboration",
        Subtext: "Collaborate with your team, friends, or clients.",
        opacity: 0.82
    },
    {
        text: "Real time",
        Subtext: "Get things done together, in real time.",
        opacity: 0.73
    },
    {
        text: "Repeating tasks",
        Subtext: "Simplify your workflow by setting tasks to repeat.",
        opacity: 0.64
    },
    {
        text: "Tasks via email",
        Subtext: "Turn emails into tasks with the click of a button.",
        opacity: 0.55
    },
    {
        text: "Reminders",
        Subtext: "Never miss a deadline with reminders.",
        opacity: 0.46
    },
    {
        text: "Infinite depth",
        Subtext: "Add a subtask, and another one, and another one…",
        opacity: 0.37
    },
    {
        text: "Multiplatform",
        Subtext: "Seamlessly work across macOS, iOS, Android, and web.",
        opacity: 0.28
    },
    {
        text: "Private & secure",
        Subtext: "Superlist is private by default. Share only what you want to.",
        opacity: 0.19
    },
    {
        text: "Fast AF",
        Subtext: "Work at the speed of light (almost).",
        opacity: 0.1
    },
]


const ListFooter = [
    {
        imgUrl: "https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ea235887e6aee51090e837_verge.png",
        text: "The Verge",
        subtext: "In a sea of ultra-efficient productivity tools, Superlist brings a little more fun to getting things done.",
    },
    {
        imgUrl: "https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ea235888adf3e3490268fc_techcrunch.png",
        text: "Tech Crunch",
        subtext: "Superlist is a well-rounded to-do list app which, unusually, allows you to split off personal to-do lists and share them with family members, friends or even co-workers."
    }
]

const SuperListColor = {
    sections: [
        {
            title: "SuperList",
            titleColor: "#f84f39",
            labels: ["Home", 'Updates', 'Pricing', 'Careers', 'Suggestions', "Help Center"]
        },
        {
            title: "",
            titleColor: "",
            labels: ['Go Pro ✨',"Open Source", "Cookies", "Privacy", "Terms", "Contact"]
        },
        {
            title: "App",
            titleColor: "#2590f2",
            labels: ["Mac", "web", "iOS", "Andriod", "Sign in"]
        }, 
        {
            title: "Social",
            titleColor: "#2a966f",
            labels: ['GitHub', 'LinkedIn', 'Instagram', 'X']
        }
    ],
    updates: {
        title: 'updates',
        text: "Improved App Window Resizing",
        version: 'v 1.19.0',
    },

    copyright: "ⓒ Superlist 2024",
    
}

const OverlapCardContent =  [
    {
        headingText: ["Tasks, notes"],
        NonColorText: ["& everything", 'in between.'],
        subtext: '',
        iframeSrc: 'https://rive.app/s/Rq6BReQCaESk8KMqvtSm-A/embed',
        bgColor: "#f3f2fa",
        textColor: '#6b66da',
        secColor: "",
        CardBgColor: "#6b66da",
        textSecondaryColor: "#26253b",
    },
    {
        headingText: ['Integrated'],
        NonColorText: ["with apps", 'you love.'],
        subtext: 'Coming soon: Notion, Loom, Zoom',
        iframeSrc: 'https://rive.app/s/2UugwsmmMECoeqqzKEA6_w/embed',
        bgColor: "#edf6f3",
        textColor: '#2a966f',
        secColor: "",
        CardBgColor: '#2b966f',
        textSecondaryColor: "#26253b",
    },
    {
        headingText: ['Work &', "personal"],
        NonColorText: ["at the flip", " of a switch."],
        subtext: "",
        iframeSrc: "https://rive.app/s/qiT3dxa-cEKGLAclD8fN6Q/embed",
        bgColor: "#fbedeb",
        textColor: "#f84f39",
        secColor: "",
        CardBgColor: "#f84f38",
        textSecondaryColor: "#26253b"
    },
    {
        headingText: ['Perfect for'],
        NonColorText: ["teams and", 'solo users.'],
        subtext: '',
        iframeSrc: "https://rive.app/s/dZyw7tSASEub-riwcYNpxA/embed",
        bgColor: "#eaf4fd",
        textColor: "",
        secColor: "#2590f2",
        CardBgColor: "#2590f2",
        textSecondaryColor: "#26253b"
    },
    {
        headingText: ["Private"],
        NonColorText: ['until you', 'are ready.'],
        Subtext: "",
        iframeSrc: "https://rive.app/s/IuVboIGT606xRaJKEVWx8w/embed",
        bgColor: "#fae3e0",
        textColor: "#f84f39",
        secColor: "",
        CardBgColor: "#f84f39",
        textSecondaryColor: "#26253b",
    }
];



const RanksLinks = [
     "https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ea1bbfc5e3f90ff5b09eb5_daily1.svg",
     "https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ea1bbf03a5f07b255b46ef_weekly1.svg",
     "https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ea1bbf5a5651917c8728d4_monthly2.svg"
]

const HSSideListContent =[
    {
        title: "Lists"
    },
    {
        image: "💥",
        text: "App Launch"
    },
    {
        image: '🏡',
        text: "Kitchen Reno"
    },
    {
        image: "🧘",
        text: "Daily habits"
    },
    {
        image: "🍔",
        text: "Recipes"
    },
    {
        image: "✏️",
        text: "Design Work"
    }
]

const ImagesForOL =[
    'https://res.cloudinary.com/superlist/image/upload/v1706228326/website/2023/misc/Jenna_vcsqbn.webp',
    'https://res.cloudinary.com/superlist/image/upload/v1706228327/website/2023/misc/Ada_palmjc.webp',
    'https://res.cloudinary.com/superlist/image/upload/v1706228327/website/2023/misc/Jon_ts9dtj.webp',
    'https://res.cloudinary.com/superlist/image/upload/v1706228328/website/2023/misc/Stan_w0kqid.webp',
    'https://res.cloudinary.com/superlist/image/upload/v1706228327/website/2023/misc/Keyla_eaebye.webp'
];

const HScontent = [
    {
        mark: true,
        markColor: true,
        title: "Launch readiness",
        textColor: '#72718A',
        progress: true,
        twoStrips: true,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303760c5a409c150729db_Ada_palmjc.webp']
    },
    {
        mark: true,
        markColor: true,
        title: "Value proportion",
        textColor: '#72718A',
        progress: true,
        twoStrips: false,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303dbf9cefe4e3524ca84_Gmail_kbjswl.webp','https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b30376cfc91a74393dc2c4_Jon_ts9dtj.webp']
    },
    {
        mark: true,
        markColor: false,
        title: "Marketing strategy",
        textColor: '',
        progress: false,
        twoStrips: false,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b3033a157a61a0e0c349e1_Stan_w0kqid.webp'],
    },
    {
        mark: true,
        markColor: false,
        title: "Design system update",
        textColor: '',
        progress: false,
        twoStrips: false,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303dbcc8a2e3777f50963_Linear_kf51lo.webp','https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b3037613ceae9d94346872_Jenna_vcsqbn.webp'],
    },
    {
        mark: true,
        markColor: false,
        title: "Website design & dev",
        textColor: '',
        progress: false,
        twoStrips: true,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b30376e03051f0ec98c136_Keyla_eaebye.webp'],
    },
    {
        mark: true,
        markColor: true,
        title: "Pricing strategy",
        textColor: '#72718A',
        progress: true,
        twoStrips: false,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65ce51c1b01c8a797334f0f5_Slack.png', 'https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b30376cfc91a74393dc2c4_Jon_ts9dtj.webp'], 
    },
    {
        mark: true,
        markColor: false,
        title: "Prepare analytics",
        textColor: "",
        progress: false,
        twoStrips: false,
        images: ['https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65b303760c5a409c150729db_Ada_palmjc.webp'],
    }
];


const  HSFContent = {
    title: "Home to",
    subTItle: "all your",
    highlightText: "lists",
    descriptionDesktop: 'Take notes, organise your work, and get more done with AI. Simple, blazingly fast, and wrapped in a beautiful UI.',
    descriptionMobile: 'For team work, personal projects, and everything in between.',
    PBT1: "start today",
    PBT2: "-- it's free",
    secondaryButtonText: "Go Pro ✨",
    imageSrc: "https://cdn.prod.website-files.com/625593a881b8ebd169835ca5/65036f273968fc089bdea9c6_dsfkgj.svg",
}

export {ListFooter, ListContent, SuperListColor, OverlapCardContent, RanksLinks, HSSideListContent, ImagesForOL,HScontent, HSFContent};