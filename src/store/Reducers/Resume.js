import { ReduxActions } from "../../constants.js";

const defaultState = {
  Experience: [
    {
      title: "Full Stack Software Engineer",
      company: "Accenture",
      location: "Sacramento, Ca",
      start_date: "Feb 2019",
      end_date: "Present",
      description:
        "CalHEERS project - working on the full stack of a web app that determines the benefits a person is entitled to under The Affordable Care Act and allows them to enroll in eligible plans.",
      bullet_points: [
        { title: "Refactored and decoupled Spring MVC services to Spring Boot" },
        { title: "Used adapter & command object-oriented design pattern" },
        { title: "Implemented admin features in React" }
      ],
      media: [
        {
          title: "Covered California™ | Official Site - Health Insurance Marketplace",
          description:
            "Covered California is California's official health insurance marketplace where individuals, families & small businesses can get brand-name health insurance and receive financial help to pay for coverage.",
          link: "https://www.coveredca.com/"
        }
      ]
    },
    {
      title: "Lead Software Engineer (Part-time)",
      company: "Insights Abroad",
      location: "Los Angeles, Ca",
      start_date: "Jun 2019",
      end_date: "Present",
      description:
        "Lead the development of an enterprise level progressive web application with React, Redux, Axios, Django, AWS S3, and Elastic",
      bullet_points: [
        { title: "Lived Agile mythologies to coordinate, test, and deliver business valued features:" },
        {
          title:
            "Student Travel / University Onboarding, Metrics / Analytics Dashboard, Profile, and marketing pages"
        },
        { title: "Adding, Voting, Commenting, and Searching content" }
      ],
      media: []
    },
    {
      title: "Lead Software Engineer (Freelance)",
      company: "Voices of Terminus",
      location: "Rocklin, California",
      start_date: "Apr 2017",
      end_date: "Jun 2019",
      description:
        "Solely developed an enterprise level progressive web application in React, Redux, Axios, and Django for a guild anticipating the release of a video game Pantheon: Rise of The Fallen.",
      bullet_points: [
        {
          title:
            "Lived agile methodologies to coordinate, test, and deliver business valued features for the client and community:"
        },
        {
          title:
            "Admin panel for guild officers to manage roster, permissions, roles, ticket requests, and polls"
        },
        { title: "Calendar system for users to schedule events / groups / raids for others to RSVP to" },
        { title: "Poll system for guild members to create detailed and robust forms for others to fill out" },
        { title: "Article and newsletter system for guild members to publish lore and content" },
        { title: "Media API system that combined the guild’s Twitter, Discord, YouTube, and Twitch content" },
        { title: "Ticket system to provide customer support and user grievances" },
        {
          title:
            "Profile page for users to edit personal / in-game information such as character's name, level, role, race, class, and profession"
        },
        {
          title:
            "Achievement system for users to earn badges and guild currency from engaging with the web app"
        },
        {
          title: "Image galleries for users to create picture galleries and associate them with their profile"
        },
        {
          title: "Messaging system for users to create message groups to converse and share data with others"
        }
      ],
      media: []
    },
    {
      title: "Full Stack Software Engineer",
      company: "People-OnTheGo",
      location: "San Jose, California",
      start_date: "Jan 2018",
      end_date: "Aug 2018",
      description:
        "Responsible for full stack development of the companies web application built in React and MongoDB",
      bullet_points: [
        { title: "Developed essential user features for a productivity application using React" },
        { title: "Laid the foundation for the admin platform to analyze user engagement metrics" },
        { title: "Established backend API rest services in MongoDB, Axios, and Redux" }
      ],
      media: []
    },
    {
      title: "Software Engineer Intern",
      company: "COBE Construction Inc.",
      location: "Campbell, Ca",
      start_date: "Sep 2017",
      end_date: "Dec 2017",
      description:
        "Develop and integrate key web application features to track performance and productivity using AngularJS. Developed the following features in AngularJS and 4D database",
      bullet_points: [
        { title: "Developed key features for employee productivity / payroll / management" },
        {
          title:
            "Delivered project report generator feature that employees used to inform and bill their clients"
        },
        {
          title:
            "Billable projects - Used a Kendo Grid table to display company projects that are still within the billing process. It supports exporting the table into excel and pdf"
        },
        {
          title:
            "Printable score card - Used radials and custom CSS to display a printable detail of a particular project. It also has a finical dynamic progress bar"
        }
      ],
      media: []
    }
  ],
  Education: [
    {
      shcool: "San Jose State University",
      degree: "Bachelor of Science",
      field_of_study: "Computer Software Engineering",
      start_year: 2016,
      end_year: 2018,
      location: "San Jose, Ca",
      grade: 3.35,
      activities_and_societies:
        "Dean Scholar, Math, Engineering, and Science Achievement (MESA) organization",
      description: "Emphasis of full stack web development",
      media: []
    },
    {
      shcool: "De Anza College",
      degree: "Computer Information Systems",
      field_of_study: "Computer Software Engineering",
      start_year: 2014,
      end_year: 2016,
      location: "Cupertino, Ca",
      grade: 3.5,
      activities_and_societies: "Video Game Engineering Club",
      description:
        "Was on the Dean's list for two consecutive semesters. Transferred to San Jose State university",
      media: []
    }
  ],
  TechnicalSkill: [
    { title: "Video Game Dev", skills: ["Three.js", "SFML", "openFrameworks", "Unreal", "Unity"] },
    {
      title: "Web Dev",
      skills: [
        "React",
        "Redux",
        "Axios",
        "Django",
        "HTML5",
        "SCSS",
        "Node.js",
        "PosgreSQL",
        "MongoDB",
        "Spring Boot"
      ]
    },
    { title: "Cloud Technologies", skills: ["Heroku", "AWS", "Elastic", "Firebase"] },
    {
      title: "Mobile Dev",
      skills: ["Progressive Web Application (PWA)", "React Native", "Swift", "Android Studio"]
    },
    { title: "Video Game Dev", skills: ["Three.js", "SFML", "openFrameworks", "Unreal", "Unity"] },
    { title: "Environments / Methodologies", skills: ["Startup", "Agile", "Waterfall", "TDD"] },
    {
      title: "Programming Languages / Tools",
      skills: ["JavaScript", "C++", "Java", "C#", "Python", "Git", "Trello", "Zeplin", "Jira", "Pivotal"]
    }
  ]
};

export const Resume = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      return { ...state };
  }
};
