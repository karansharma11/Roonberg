const data = {
  projectList: [
    {
      _id: "1",
      agentName: "Agent 1",
      contractorName: "Contractor A",
      projectName: "Project Alpha",
      startDate: "2023-01-10",
      endDate: "2023-03-15",
      progress: 30,
    },
    {
      _id: "2",
      agentName: "Agent 2",
      contractorName: "Contractor B",
      projectName: "Project Beta",
      startDate: "2023-02-15",
      endDate: "2023-04-20",
      progress: 45,
    },
    {
      _id: "3",
      agentName: "Agent 3",
      contractorName: "Contractor C",
      projectName: "Project Gamma",
      startDate: "2023-03-20",
      endDate: "2023-05-25",
      progress: 60,
    },
    {
      _id: "4",
      agentName: "Agent 4",
      contractorName: "Contractor A",
      projectName: "Project Delta",
      startDate: "2023-04-25",
      endDate: "2023-06-30",
      progress: 75,
    },
    {
      _id: "5",
      agentName: "Agent 5",
      contractorName: "Contractor B",
      projectName: "Project Epsilon",
      startDate: "2023-06-01",
      endDate: "2023-08-10",
      progress: 90,
    },
    {
      _id: "6",
      agentName: "Agent 6",
      contractorName: "Contractor C",
      projectName: "Project Zeta",
      startDate: "2023-07-10",
      endDate: "2023-09-15",
      progress: 15,
    },
    {
      _id: "7",
      agentName: "Agent 7",
      contractorName: "Contractor A",
      projectName: "Project Eta",
      startDate: "2023-08-15",
      endDate: "2023-10-20",
      progress: 25,
    },
    {
      _id: "8",
      agentName: "Agent 8",
      contractorName: "Contractor B",
      projectName: "Project Theta",
      startDate: "2023-09-20",
      endDate: "2023-11-25",
      progress: 50,
    },
    {
      _id: "9",
      agentName: "Agent 9",
      contractorName: "Contractor C",
      projectName: "Project Iota",
      startDate: "2023-10-25",
      endDate: "2023-12-30",
      progress: 70,
    },
    {
      _id: "10",
      agentName: "Agent 10",
      contractorName: "Contractor A",
      projectName: "Project Kappa",
      startDate: "2023-11-30",
      endDate: "2024-01-05",
      progress: 80,
    },
  ],
  categories: [
    {
      _id: "101",
      categoryName: "Category 1",
      sortDesc: "Sort Description 1",
      categoryImg: "image_url_1.jpg",
    },
    {
      _id: "102",
      categoryName: "Category 2",
      sortDesc: "Sort Description 2",
      categoryImg: "image_url_2.jpg",
    },
    {
      _id: "103",
      categoryName: "Category 3",
      sortDesc: "Sort Description 3",
      categoryImg: "image_url_3.jpg",
    },
    {
      _id: "104",
      categoryName: "Category 4",
      sortDesc: "Sort Description 4",
      categoryImg: "image_url_4.jpg",
    },
    {
      _id: "105",
      categoryName: "Category 5",
      sortDesc: "Sort Description 5",
      categoryImg: "image_url_5.jpg",
    },
    {
      _id: "106",
      categoryName: "Category 6",
      sortDesc: "Sort Description 6",
      categoryImg: "image_url_6.jpg",
    },
    {
      _id: "107",
      categoryName: "Category 7",
      sortDesc: "Sort Description 7",
      categoryImg: "image_url_7.jpg",
    },
    {
      _id: "108",
      categoryName: "Category 8",
      sortDesc: "Sort Description 8",
      categoryImg: "image_url_8.jpg",
    },
    {
      _id: "109",
      categoryName: "Category 9",
      sortDesc: "Sort Description 9",
      categoryImg: "image_url_9.jpg",
    },
    {
      _id: "1010",
      categoryName: "Category 10",
      sortDesc: "Sort Description 10",
      categoryImg: "image_url_10.jpg",
    },
  ],

  adminData: [
    {
      _id: "1",
      username: "admin1",
      firstName: "Admin",
      lastName: "One",
      email: "admin1@example.com",
    },
    {
      _id: "2",
      username: "admin2",
      firstName: "Admin",
      lastName: "Two",
      email: "admin2@example.com",
    },
    {
      _id: "3",
      username: "admin3",
      firstName: "Admin",
      lastName: "Three",
      email: "admin3@example.com",
    },
    {
      _id: "4",
      username: "admin4",
      firstName: "Admin",
      lastName: "Four",
      email: "admin4@example.com",
    },
    {
      _id: "5",
      username: "admin5",
      firstName: "Admin",
      lastName: "Five",
      email: "admin5@example.com",
    },
    {
      _id: "6",
      username: "admin6",
      firstName: "Admin",
      lastName: "Six",
      email: "admin6@example.com",
    },
    {
      _id: "7",
      username: "admin7",
      firstName: "Admin",
      lastName: "Seven",
      email: "admin7@example.com",
    },
    {
      _id: "8",
      username: "admin8",
      firstName: "Admin",
      lastName: "Eight",
      email: "admin8@example.com",
    },
    {
      _id: "9",
      username: "admin9",
      firstName: "Admin",
      lastName: "Nine",
      email: "admin9@example.com",
    },
    {
      _id: "10",
      username: "admin10",
      firstName: "Admin",
      lastName: "Ten",
      email: "admin10@example.com",
    },
  ],
  agentData: [
    {
      _id: "1",
      username: "agent1",
      firstName: "John",
      lastName: "Doe",
      email: "agent1@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 1",
    },
    {
      _id: "2",
      username: "agent2",
      firstName: "Jane",
      lastName: "Smith",
      email: "agent2@example.com",
      userStatus: "Free",
      assignedCategory: "Category 2",
    },
    {
      _id: "3",
      username: "agent3",
      firstName: "Michael",
      lastName: "Johnson",
      email: "agent3@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 3",
    },
    {
      _id: "4",
      username: "agent4",
      firstName: "Sarah",
      lastName: "Williams",
      email: "agent4@example.com",
      userStatus: "Free",
      assignedCategory: "Category 4",
    },
    {
      _id: "5",
      username: "agent5",
      firstName: "David",
      lastName: "Brown",
      email: "agent5@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 5",
    },
    {
      _id: "6",
      username: "agent6",
      firstName: "Emily",
      lastName: "Jones",
      email: "agent6@example.com",
      userStatus: "Free",
      assignedCategory: "Category 6",
    },
    {
      _id: "7",
      username: "agent7",
      firstName: "Daniel",
      lastName: "Davis",
      email: "agent7@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 7",
    },
    {
      _id: "8",
      username: "agent8",
      firstName: "Olivia",
      lastName: "White",
      email: "agent8@example.com",
      userStatus: "Free",
      assignedCategory: "Category 8",
    },
    {
      _id: "9",
      username: "agent9",
      firstName: "Liam",
      lastName: "Martinez",
      email: "agent9@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 9",
    },
    {
      _id: "10",
      username: "agent10",
      firstName: "Ava",
      lastName: "Garcia",
      email: "agent10@example.com",
      userStatus: "Free",
      assignedCategory: "Category 10",
    },
    {
      _id: "11",
      username: "agent11",
      firstName: "William",
      lastName: "Thomas",
      email: "agent11@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 1",
    },
    {
      _id: "12",
      username: "agent12",
      firstName: "Sophia",
      lastName: "Brown",
      email: "agent12@example.com",
      userStatus: "Free",
      assignedCategory: "Category 2",
    },
    {
      _id: "13",
      username: "agent13",
      firstName: "James",
      lastName: "Miller",
      email: "agent13@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 3",
    },
    {
      _id: "14",
      username: "agent14",
      firstName: "Olivia",
      lastName: "Wilson",
      email: "agent14@example.com",
      userStatus: "Free",
      assignedCategory: "Category 4",
    },
    {
      _id: "15",
      username: "agent15",
      firstName: "Benjamin",
      lastName: "Anderson",
      email: "agent15@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 5",
    },
    {
      _id: "16",
      username: "agent16",
      firstName: "Mia",
      lastName: "Harris",
      email: "agent16@example.com",
      userStatus: "Free",
      assignedCategory: "Category 6",
    },
    {
      _id: "17",
      username: "agent17",
      firstName: "Elijah",
      lastName: "Lee",
      email: "agent17@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 7",
    },
    {
      _id: "18",
      username: "agent18",
      firstName: "Charlotte",
      lastName: "Gonzalez",
      email: "agent18@example.com",
      userStatus: "Free",
      assignedCategory: "Category 8",
    },
    {
      _id: "19",
      username: "agent19",
      firstName: "Carter",
      lastName: "Rodriguez",
      email: "agent19@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 9",
    },
    {
      _id: "20",
      username: "agent20",
      firstName: "Amelia",
      lastName: "Moore",
      email: "agent20@example.com",
      userStatus: "Free",
      assignedCategory: "Category 10",
    },
  ],
  projectList: [
    {
      _id: "1",
      agentName: "Agent 1",
      contractorName: "Contractor A",
      projectName: "Project Alpha",
      startDate: "2023-01-10",
      endDate: "2023-03-15",
      progress: 30,
    },
    {
      _id: "2",
      agentName: "Agent 2",
      contractorName: "Contractor B",
      projectName: "Project Beta",
      startDate: "2023-02-15",
      endDate: "2023-04-20",
      progress: 45,
    },
    {
      _id: "3",
      agentName: "Agent 3",
      contractorName: "Contractor C",
      projectName: "Project Gamma",
      startDate: "2023-03-20",
      endDate: "2023-05-25",
      progress: 60,
    },
    {
      _id: "4",
      agentName: "Agent 4",
      contractorName: "Contractor A",
      projectName: "Project Delta",
      startDate: "2023-04-25",
      endDate: "2023-06-30",
      progress: 75,
    },
    {
      _id: "5",
      agentName: "Agent 5",
      contractorName: "Contractor B",
      projectName: "Project Epsilon",
      startDate: "2023-06-01",
      endDate: "2023-08-10",
      progress: 90,
    },
    {
      _id: "6",
      agentName: "Agent 6",
      contractorName: "Contractor C",
      projectName: "Project Zeta",
      startDate: "2023-07-10",
      endDate: "2023-09-15",
      progress: 15,
    },
    {
      _id: "7",
      agentName: "Agent 7",
      contractorName: "Contractor A",
      projectName: "Project Eta",
      startDate: "2023-08-15",
      endDate: "2023-10-20",
      progress: 25,
    },
    {
      _id: "8",
      agentName: "Agent 8",
      contractorName: "Contractor B",
      projectName: "Project Theta",
      startDate: "2023-09-20",
      endDate: "2023-11-25",
      progress: 50,
    },
    {
      _id: "9",
      agentName: "Agent 9",
      contractorName: "Contractor C",
      projectName: "Project Iota",
      startDate: "2023-10-25",
      endDate: "2023-12-30",
      progress: 70,
    },
    {
      _id: "10",
      agentName: "Agent 10",
      contractorName: "Contractor A",
      projectName: "Project Kappa",
      startDate: "2023-11-30",
      endDate: "2024-01-05",
      progress: 80,
    },
  ],
  categories: [
    {
      _id: "101",
      categoryName: "Category 1",
      sortDesc: "Sort Description 1",
      categoryImg: "image_url_1.jpg",
    },
    {
      _id: "102",
      categoryName: "Category 2",
      sortDesc: "Sort Description 2",
      categoryImg: "image_url_2.jpg",
    },
    {
      _id: "103",
      categoryName: "Category 3",
      sortDesc: "Sort Description 3",
      categoryImg: "image_url_3.jpg",
    },
    {
      _id: "104",
      categoryName: "Category 4",
      sortDesc: "Sort Description 4",
      categoryImg: "image_url_4.jpg",
    },
    {
      _id: "105",
      categoryName: "Category 5",
      sortDesc: "Sort Description 5",
      categoryImg: "image_url_5.jpg",
    },
    {
      _id: "106",
      categoryName: "Category 6",
      sortDesc: "Sort Description 6",
      categoryImg: "image_url_6.jpg",
    },
    {
      _id: "107",
      categoryName: "Category 7",
      sortDesc: "Sort Description 7",
      categoryImg: "image_url_7.jpg",
    },
    {
      _id: "108",
      categoryName: "Category 8",
      sortDesc: "Sort Description 8",
      categoryImg: "image_url_8.jpg",
    },
    {
      _id: "109",
      categoryName: "Category 9",
      sortDesc: "Sort Description 9",
      categoryImg: "image_url_9.jpg",
    },
    {
      _id: "1010",
      categoryName: "Category 10",
      sortDesc: "Sort Description 10",
      categoryImg: "image_url_10.jpg",
    },
  ],
  contractorData: [
    {
      _id: "1",
      username: "contractor1",
      firstName: "Mark",
      lastName: "Johnson",
      email: "contractor1@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 1",
    },
    {
      _id: "2",
      username: "contractor2",
      firstName: "Emma",
      lastName: "Smith",
      email: "contractor2@example.com",
      userStatus: "Free",
      assignedCategory: "Category 2",
    },
    {
      _id: "3",
      username: "contractor3",
      firstName: "John",
      lastName: "Doe",
      email: "contractor3@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 3",
    },
    {
      _id: "4",
      username: "contractor4",
      firstName: "Sarah",
      lastName: "Williams",
      email: "contractor4@example.com",
      userStatus: "Free",
      assignedCategory: "Category 4",
    },
    {
      _id: "5",
      username: "contractor5",
      firstName: "David",
      lastName: "Brown",
      email: "contractor5@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 5",
    },
    {
      _id: "6",
      username: "contractor6",
      firstName: "Emily",
      lastName: "Jones",
      email: "contractor6@example.com",
      userStatus: "Free",
      assignedCategory: "Category 6",
    },
    {
      _id: "7",
      username: "contractor7",
      firstName: "Daniel",
      lastName: "Davis",
      email: "contractor7@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 7",
    },
    {
      _id: "8",
      username: "contractor8",
      firstName: "Olivia",
      lastName: "White",
      email: "contractor8@example.com",
      userStatus: "Free",
      assignedCategory: "Category 8",
    },
    {
      _id: "9",
      username: "contractor9",
      firstName: "Liam",
      lastName: "Martinez",
      email: "contractor9@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 9",
    },
    {
      _id: "10",
      username: "contractor10",
      firstName: "Ava",
      lastName: "Garcia",
      email: "contractor10@example.com",
      userStatus: "Free",
      assignedCategory: "Category 10",
    },
  ],
  adminData: [
    {
      _id: "1",
      username: "admin1",
      firstName: "Admin",
      lastName: "One",
      email: "admin1@example.com",
    },
    {
      _id: "2",
      username: "admin2",
      firstName: "Admin",
      lastName: "Two",
      email: "admin2@example.com",
    },
    {
      _id: "3",
      username: "admin3",
      firstName: "Admin",
      lastName: "Three",
      email: "admin3@example.com",
    },
    {
      _id: "4",
      username: "admin4",
      firstName: "Admin",
      lastName: "Four",
      email: "admin4@example.com",
    },
    {
      _id: "5",
      username: "admin5",
      firstName: "Admin",
      lastName: "Five",
      email: "admin5@example.com",
    },
    {
      _id: "6",
      username: "admin6",
      firstName: "Admin",
      lastName: "Six",
      email: "admin6@example.com",
    },
    {
      _id: "7",
      username: "admin7",
      firstName: "Admin",
      lastName: "Seven",
      email: "admin7@example.com",
    },
    {
      _id: "8",
      username: "admin8",
      firstName: "Admin",
      lastName: "Eight",
      email: "admin8@example.com",
    },
    {
      _id: "9",
      username: "admin9",
      firstName: "Admin",
      lastName: "Nine",
      email: "admin9@example.com",
    },
    {
      _id: "10",
      username: "admin10",
      firstName: "Admin",
      lastName: "Ten",
      email: "admin10@example.com",
    },
  ],
  agentData: [
    {
      _id: "1",
      username: "agent1",
      firstName: "John",
      lastName: "Doe",
      email: "agent1@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 1",
    },
    {
      _id: "2",
      username: "agent2",
      firstName: "Jane",
      lastName: "Smith",
      email: "agent2@example.com",
      userStatus: "Free",
      assignedCategory: "Category 2",
    },
    {
      _id: "3",
      username: "agent3",
      firstName: "Michael",
      lastName: "Johnson",
      email: "agent3@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 3",
    },
    {
      _id: "4",
      username: "agent4",
      firstName: "Sarah",
      lastName: "Williams",
      email: "agent4@example.com",
      userStatus: "Free",
      assignedCategory: "Category 4",
    },
    {
      _id: "5",
      username: "agent5",
      firstName: "David",
      lastName: "Brown",
      email: "agent5@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 5",
    },
    {
      _id: "6",
      username: "agent6",
      firstName: "Emily",
      lastName: "Jones",
      email: "agent6@example.com",
      userStatus: "Free",
      assignedCategory: "Category 6",
    },
    {
      _id: "7",
      username: "agent7",
      firstName: "Daniel",
      lastName: "Davis",
      email: "agent7@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 7",
    },
    {
      _id: "8",
      username: "agent8",
      firstName: "Olivia",
      lastName: "White",
      email: "agent8@example.com",
      userStatus: "Free",
      assignedCategory: "Category 8",
    },
    {
      _id: "9",
      username: "agent9",
      firstName: "Liam",
      lastName: "Martinez",
      email: "agent9@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 9",
    },
    {
      _id: "10",
      username: "agent10",
      firstName: "Ava",
      lastName: "Garcia",
      email: "agent10@example.com",
      userStatus: "Free",
      assignedCategory: "Category 10",
    },
    {
      _id: "11",
      username: "agent11",
      firstName: "William",
      lastName: "Thomas",
      email: "agent11@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 1",
    },
    {
      _id: "12",
      username: "agent12",
      firstName: "Sophia",
      lastName: "Brown",
      email: "agent12@example.com",
      userStatus: "Free",
      assignedCategory: "Category 2",
    },
    {
      _id: "13",
      username: "agent13",
      firstName: "James",
      lastName: "Miller",
      email: "agent13@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 3",
    },
    {
      _id: "14",
      username: "agent14",
      firstName: "Olivia",
      lastName: "Wilson",
      email: "agent14@example.com",
      userStatus: "Free",
      assignedCategory: "Category 4",
    },
    {
      _id: "15",
      username: "agent15",
      firstName: "Benjamin",
      lastName: "Anderson",
      email: "agent15@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 5",
    },
    {
      _id: "16",
      username: "agent16",
      firstName: "Mia",
      lastName: "Harris",
      email: "agent16@example.com",
      userStatus: "Free",
      assignedCategory: "Category 6",
    },
    {
      _id: "17",
      username: "agent17",
      firstName: "Elijah",
      lastName: "Lee",
      email: "agent17@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 7",
    },
    {
      _id: "18",
      username: "agent18",
      firstName: "Charlotte",
      lastName: "Gonzalez",
      email: "agent18@example.com",
      userStatus: "Free",
      assignedCategory: "Category 8",
    },
    {
      _id: "19",
      username: "agent19",
      firstName: "Carter",
      lastName: "Rodriguez",
      email: "agent19@example.com",
      userStatus: "Paid",
      assignedCategory: "Category 9",
    },
    {
      _id: "20",
      username: "agent20",
      firstName: "Amelia",
      lastName: "Moore",
      email: "agent20@example.com",
      userStatus: "Free",
      assignedCategory: "Category 10",
    },
  ],
}

export default data;
