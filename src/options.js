//
// LibreTexts Adoption Report Widget
// options.js (form option lists)
//

var iAmOptions = [
    { name: 'Student', value: 'student' },
    { name: 'Instructor', value: 'instructor'}
];

var libreNetOptions = [
    { name: "ASCCC", value: "ASCCC" },
    { name: "CalState University", value: "CalState University" },
    { name: "Contra Costa Community College", value: "Contra Costa Community College" },
    { name: "Harrisburg Area Community College", value: "Harrisburg Area Community College" },
    { name: "Hope College", value: "Hope College" },
    { name: "Kansas State University", value: "Kansas State University" },
    { name: "Los Rios Community College", value: "Los Rios Community College" },
    { name: "Prince George's Community College", value: "Prince George's Community College" },
    { name: "University of Arkansas at Little Rock", value: "University of Arkansas at Little Rock" },
    { name: "University of California, Davis", value: "University of California, Davis" },
    { name: "University of Hawaii", value: "University of Hawaii" },
    { name: "Other", value: "Other" }
];

var instrTaughtOptions = [
    { name: 'Fall Quarter 2019', value: 'fq19' },
    { name: 'Fall Semester 2019', value: 'fs19' },
    { name: 'Winter Quarter 2020', value: 'wq20' },
    { name: 'Spring Quarter 2020', value: 'sq20' },
    { name: 'Spring Semester 2020', value: 'ss20' },
    { name: 'Summer 2020', value: 'sum20' },
    { name: 'Fall Quarter 2020', value: 'fq20' },
    { name: 'Fall Semester 2020', value: 'fs20' },
    { name: 'Winter Quarter 2021', value: 'wq21' },
    { name: 'Spring Quarter 2021', value: 'sq21' },
    { name: 'Spring Semester 2021', value: 'ss21' },
    { name: 'Summer 2021', value: 'sum21' }
];

 var studentUseOptions = [
    { name: 'As the primary textbook', value: 'Primary Textbook' },
    { name: 'Supplementary resource (suggested by instructor)', value: 'Supplementary (suggested by instructor)' },
    { name: 'Supplementary resource (not suggested by instructor)', value: 'Supplementary (not suggested by instructor)' }
 ];

 module.exports = {
     iAmOptions,
     libreNetOptions,
     instrTaughtOptions,
     studentUseOptions
 }
