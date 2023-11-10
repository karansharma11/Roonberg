import express from "express";
import Project from "../Models/projectModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdminOrSelf, sendEmailNotify } from "../util.js";
import User from "../Models/userModel.js";
import Conversation from "../Models/conversationModel.js";
import Category from "../Models/categoryModel.js";
import CustomEmail from "../Models/customEmailModul.js";
import { storeNotification } from "../server.js";
import { Socket, io } from "socket.io-client";
const SocketUrl = process.env.SOCKETURL || 'ws://localhost:8900';
const socket = io(SocketUrl);

// const io = require('../socket/index.js');
// import io from '../../socket/index.js'

socket.emit("connectionForNotify", () => {
  console.log("connectionForNotif user connnercted");
});


const projectRouter = express.Router();
// get all projects
projectRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      // Check user's role and determine which projects to retrieve
      const userRole = req.user.role; // Replace with the actual way you get the user's role

      if (userRole === "admin" || userRole === "superadmin") {
        // Admin and superadmin can access all projects
        const projects = await Project.find();
        projects.sort((a, b) => b.createdAt - a.createdAt); //for data descending order
        res.json(projects);
      } else if (userRole === "contractor") {
        // Contractors can only access their own projects
        const contractorId = req.user._id; // Replace with the actual way you identify the contractor
        const projects = await Project.find({ projectOwner: contractorId });
        projects.sort((a, b) => b.createdAt - a.createdAt); //for data descending order
        res.json(projects);
      } else if (userRole === "agent") {
        // Contractors can only access their own projects
        const agentId = req.user._id; // Replace with the actual way you identify the contractor
        const projects = await Project.find({
          "assignedAgent.agentId": agentId,
        });
        projects.sort((a, b) => b.createdAt - a.createdAt); //for data descending order
        res.json(projects);
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

// user create project
projectRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const categoryIds = req.body.projectCategory;
      // const getCategoryNames = async (categoryIds) => {
      //   const categoryNames = [];
      //   for (const categoryId of categoryIds) {
      //     const category = await Category.findById(categoryId);
      //     if (category) {
      //       categoryNames.push(category.categoryName);
      //     }
      //   }
      //   return categoryNames;
      // };

      // const categoryNames = await getCategoryNames(categoryIds);
      const projectCategorys = [];

      for (let i = 0; i < categoryIds.length; i++) {
        projectCategorys.push({
          categoryId: categoryIds[i],
          // categoryName: categoryNames[i],
        });
      }

      const newProject = new Project({
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        // projectCategory: projectCategorys,
        assignedAgent: projectCategorys,
        createdDate: req.body.createdDate,
        endDate: req.body.endDate,
        projectStatus: req.body.projectStatus,
        projectOwner: req.user._id,
      });
      const project = await newProject.save();

      const adminEmails = await User.find({ role: "admin" }, "email");
      console.log("adminId", adminEmails._id);
      const emails = adminEmails.map((user) => user.email);
      const user = await User.findById(req.user._id, "first_name email");

      const options = {
        to: emails.toString(),
        subject: "New Project Created ✔",
        template: "CREATE-PROJECT",
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        user,
      };
      const checkMail = await sendEmailNotify(options);
      if (checkMail) {
        for (const adminemailid of adminEmails) {
          const notifyUser = adminemailid._id;
          const message = `New Project Created  Project Name - ${options.projectName},Description - ${options.projectDescription}`;
          const status = "unseen";
          const type = "project";
          storeNotification(message, notifyUser, status, type);
          console.log("notifyProjectBackend", notifyUser, message)
          socket.emit("notifyProjectBackend", notifyUser, message);
          // const resultNotify = await storeNotification.save();
          // console.log("resultNotify", resultNotify);
        }
      } else {
        console.log("email not send");
      }
      res
        .status(201)
        .json({ message: "Project Created", project });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating project", error });
    }
  })
);

// delete project
projectRouter.delete(
  "/:id",
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.status(200).json("Project has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  })
);

// user update project
projectRouter.put(
  "/update/:id",
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      const { projectName, projectDescription, assignedAgent, createdDate, endDate, projectStatus, projectOwner } = req.body;
      const updatedData = {
        projectName: projectName,
        projectDescription: projectDescription,
        // projectCategory: projectCategorys,
        assignedAgent,
        createdDate,
        endDate,
        projectStatus,
        projectOwner,
      };
      const dataprojectupdate = await project.updateOne({ $set: updatedData });
      console.log("dataprojectupdate", dataprojectupdate);
        const notifyUser = project.projectOwner;
        const message = `Your Project has been updated `;
        const status = "unseen";
        const type = "project";
        storeNotification(message, notifyUser, status, type);
        console.log("notifyProjectBackend", notifyUser, message)
        socket.emit("notifyProjectBackend", notifyUser, message);
    
      res.status(200).json("update successfully");
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong, please try again",
        error: err,
      });
    }
  })
);


// get single project by userid
projectRouter.get(
  "/getproject/:userId",
  expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("userid", userId);
      const projects = await Project.find({
        $or: [
          { projectOwner: userId },
          {
            "assignedAgent.agentId": userId,
          },
        ],
      });
      if (!projects || projects.length === 0) {
        res.status(404).json({ message: "No projects found for this user" });
      } else {
        const projectIds = projects.map((project) => project._id);
        const conversations = await Conversation.find({
          projectId: { $in: projectIds },
        });
        res.json({ projects, conversations });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

// get single project
projectRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await Project.findById(req.params.id);
      const project = await Project.findById(req.params.id);
      if (!project) {
        console.log(project);
        res.status(400).json({ message: "Project not found" });
      }
      const conversions = await Conversation.find({ projectId: req.params.id });
      const customEmail = await CustomEmail.find({ projectId: req.params.id });
      const { ...other } = project._doc;
      res.json({
        ...other,
        conversions: conversions,
        customEmail: customEmail,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

// *************** Admin Api's *********************

// projectRouter.put(
//   "/remove-agentCategoryPair/:id",
//   isAuth,
//   isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const projectId = req.params.id;
//       const agentIndexToRemove = req.body.agentIndex;
//       const updatedProject = await Project.findById(projectId);
//       if (!updatedProject) {
//         return res.status(404).json({ error: "Project not found" });
//       }
//       const removedAgent = updatedProject.assignedAgent[agentIndexToRemove];
//       const agentIdString = `${removedAgent.agentId.toString()}`;
//       const projectOwnerIdString = `${updatedProject.projectOwner.toString()}`;
//       const membersArray = [agentIdString, projectOwnerIdString];
//       await Conversation.deleteMany({
//         members: membersArray,
//         projectId: projectId,
//       });
//       updatedProject.assignedAgent.splice(agentIndexToRemove, 1);
//       await updatedProject.save();
//       res.status(200).json({ updatedProject });
//     } catch (error) {
//       res.status(500).json({ error: "Error removing agent" });
//     }
//   })
// );

// admin add project
projectRouter.post(
  "/admin/addproject",
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      function capitalizeFirstLetter(data) {
        return data.charAt(0).toUpperCase() + data.slice(1);
      }
      const userRole = req.user.role;
      const contractorId = req.body.projectOwner;
      const assignedAgent = req.body.assignedAgent;
      const agentIds = assignedAgent
        .filter((agent) => agent.agentId)
        .map((agent) => agent.agentId);
      const user = await User.findById(contractorId, "first_name email");
      const contractorOnly = !agentIds.length;

      if (userRole === "admin" || userRole === "superadmin") {
        const newProject = new Project({
          projectName: capitalizeFirstLetter(req.body.projectName),
          projectDescription: capitalizeFirstLetter(req.body.projectDescription),
          projectCategory: req.body.projectCategory,
          createdDate: req.body.createdDate,
          endDate: req.body.endDate,
          projectStatus: capitalizeFirstLetter(req.body.projectStatus),
          projectOwner: contractorId,
          assignedAgent: assignedAgent,
        });

        const project = await newProject.save();
        console.log(project, "projectproject");

        const agentEmails = await User.find(
          { _id: { $in: agentIds } },
          "email"
        );
        if (contractorOnly) {
          const options = {
            to: user.email,
            subject: "New Project Create✔ ",
            template: "ASSIGN-PROJECT",
            projectName: req.body.projectName,
            projectDescription: req.body.projectDescription,
            user,
          };
          const emailSendCheck = await sendEmailNotify(options);
          if (emailSendCheck) {
            const notifyUser = user._id;
            const message = `New Project Create  Project Name - ${options.projectName},Description - ${options.projectDescription}`;
            const status = "unseen";
            const type = "project";
            storeNotification(message, notifyUser, status, type);
            socket.emit("notifyProjectBackend", notifyUser, message);


          } else {
            console.log("email not send");
          }
        } else {
          const agentEmailList = agentEmails.map((agent) => agent.email);
          const toEmails = [user.email, ...agentEmailList];
          const toUserIds = [...agentIds, user._id];
          const options = {
            to: toEmails,
            subject: "New Project Assigned ✔",
            template: "CREATE-PROJECT",
            projectName: req.body.projectName,
            projectDescription: req.body.projectDescription,
            user,
          };
          const emailSendCheck = await sendEmailNotify(options);
          if (emailSendCheck) {
            for (const userId of toUserIds) {
              if(userId !== undefined){
              const notifyUser = userId;
              const message = `New Project Assigned  Project Name - ${options.projectName},Description - ${options.projectDescription}`;
              const status = "unseen";
              const type = "project";

              storeNotification(message, notifyUser, status, type);
              socket.emit("notifyProjectBackend", notifyUser, message);
            }
              // console.log("resultNotify", resultNotify);
            }
          } else {
            console.log("email not send");
          }

          for (const agentId of agentIds) {
            const newConversation = new Conversation({
              members: [agentId, contractorId],
              projectId: project._id,
            });
            await newConversation.save();
          }
          for (const agentId of agentIds) {
            const agentEmail = await User.findById(agentId, "email");
            const newCustomEmail = new CustomEmail({
              projectId: project._id,
              contractorEmail: user.email,
              contractorCustomEmail: `${contractorId}_${project._id
                }_${new Date().toISOString().replace(/[^0-9]/g, "")}`,
              agentEmail: agentEmail.email,
              agentCustomEmail: `${agentId}${project._id}${new Date()
                .toISOString()
                .replace(/[^0-9]/g, "")}`,
            });
            await newCustomEmail.save();
          }
        }
        res.status(200).json({ message: "Project Created", project });
      } else {
        res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  })
);

// projectRouter.post(
//   '/admin/addproject',
//   isAuth,
//   isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       const userRole = req.user.role;
//       const contractorId = req.body.projectOwner;
//       const assignedAgent = req.body.assignedAgent;
//       const categoryId = req.body.categoryId;

//       const agentIds = assignedAgent.map((agent) => agent.agentId);
//       console.log('agentIds', agentIds);
//       const user = await User.findById(contractorId, 'first_name email');
//       const agentuser = await User.findById(
//         assignedAgent,
//         '_id first_name email'
//       );
//       const category = await Category.findById(categoryId);

//       if (userRole === 'admin' || userRole === 'superadmin') {
//         const newProject = new Project({
//           projectName: req.body.projectName,
//           projectDescription: req.body.projectDescription,
//           projectCategory: req.body.projectCategory,
//           createdDate: req.body.createdDate,
//           endDate: req.body.endDate,
//           projectStatus: req.body.projectStatus,
//           projectOwner: contractorId,
//           assignedAgent: assignedAgent,
//         });
//         console.log("projectCreated", newProject)
//         const project = await newProject.save();

//         const agentEmails = await User.find(
//           { _id: { $in: agentIds } },
//           'email'
//         );
//         const agentEmailList = agentEmails.map((agent) => agent.email);

//         const toEmails = [user.email, ...agentEmailList];
//         const options = {
//           to: toEmails,
//           subject: 'New Project Create✔',
//           template: 'CREATE-PROJECT',
//           projectName: req.body.projectName,
//           projectDescription: req.body.projectDescription,
//           user,
//         };
//         await sendEmailNotify(options);

//         if (project.assignedAgent) {
//           const newConversation = new Conversation({
//             members: [user._id, updatedProject.projectOwner],
//             projectId: project._id,
//           });
//           await newConversation.save();
//         }
//         res.status(201).json({ message: 'Project Created', project });
//       } else {
//         res.status(403).json({ message: 'Access denied' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   })
// );

//  Admin Assign  Project
projectRouter.post(
  "/assign-project/:id",
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      const projectId = req.params.id;
      const previousProject = await Project.findById(projectId);
      const previousAssignedAgent = previousProject.assignedAgent;
      const agent = req.body.assignedAgent;
      const contractorId = req.body.projectOwner;
      const user = await User.findById(contractorId, "first_name email");
      const agentIds = agent.map((agent) => agent.agentId);
      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          assignedAgent: agent,
        },
        { new: true }
      );

      const updatedAssignedAgent = updatedProject.assignedAgent;

      const newAssignedAgent = updatedAssignedAgent.filter((updatedAgent) => {
        return !previousAssignedAgent.some((previousAgent) =>
          previousAgent?.agentId?.equals(updatedAgent.agentId)
        );
      });

      const filterAgentIds = newAssignedAgent.map((agent) =>
        agent?.agentId?.toString()
      );
      const agentEmails = await User.find(
        { _id: { $in: filterAgentIds } },
        "email"
      );
      const agentEmailList = agentEmails.map((agent) => agent.email);
      const toUserIds = [...filterAgentIds, contractorId];

      const options = {
        to: [agentEmailList, user.email],
        subject: "New Project Assign ✔",
        template: "CREATE-PROJECT",
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        agentEmailList,
      };

      const emailSendCheck = await sendEmailNotify(options);

      if (emailSendCheck) {
        for (const userId of toUserIds) {

          if(userId !== undefined){
          const notifyUser = userId;
          const message = `${options.subject}Project Name - ${options.projectName},Description - ${options.projectDescription}`;
          const status = "unseen";
          const type = "project";

          storeNotification(message, notifyUser, status, type);
          socket.emit("notifyProjectBackend", notifyUser, message);
        }

          // const resultNotify = await storeNotification.save();

          // console.log("resultNotify", resultNotify);
        }
      } else {
        console.log("email not send");
      }

      for (const agentId of agentIds) {

        const existingConversation = await Conversation.findOne({
          members: [agentId, contractorId],
          projectId: projectId,
        });

        if (!existingConversation) {
          const newConversation = new Conversation({
            members: [agentId, contractorId],
            projectId: projectId,
          });
          await newConversation.save();
        } else {
          console.log("Conversation already exists:", existingConversation);
        }
      }

      res.status(200).json({ updatedProject, agent: agentIds });
    } catch (error) {
      console.error("Error assigning the project:", error);
      res.status(500).json({ error: "Error assigning the project" });
    }
  })
);

// Admin Assign and Update Project
// projectRouter.put(
//   "/assign-update/:id",
//   isAuth,
//   isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       if (req.user.role !== "admin" && req.user.role !== "superadmin") {
//         return res.status(403).json({ error: "Access denied" });
//       }
//       const projectId = req.params.id;
//       const previousProject = await Project.findById(projectId);
//       const previousAssignedAgent = previousProject.assignedAgent;
//       const contractorId = req.body.projectOwner;
//       const assignedAgent = req.body.assignedAgent;
//       const agentIds = assignedAgent
//         .filter((agent) => agent.agentId)
//         .map((agent) => agent.agentId);

//       const user = await User.findById(contractorId, "first_name email");
//       const contractorOnly = !agentIds.length;
//       const updateFields = {
//         assignedAgent,
//         projectName: req.body.projectName,
//         projectDescription: req.body.projectDescription,
//         createdDate: req.body.createdDate,
//         endDate: req.body.endDate,
//         projectStatus: req.body.projectStatus,
//         projectOwner: contractorId,
//       };
//       const agentIdss = [];

//       updateFields.assignedAgent.forEach(agent => {
//         if (agent.agentId && agent.categoryId) {
//           agentIdss.push(agent.agentId, agent.categoryId);
//         }
//       });

//       console.log(agentIdss);
//       // const updatedProject = await Project.findByIdAndUpdate(
//       //   projectId,
//       //   { $set: updateFields },
//       //   { new: true }
//       // );

//       // if (contractorOnly) {
//       //   const options = {
//       //     to: user.email,
//       //     subject: "New Project Assigned ✔",
//       //     template: "ASSIGN-PROJECT",
//       //     projectName: updatedProject.projectName,
//       //     projectDescription: updatedProject.projectDescription,
//       //     user,
//       //   };
//       //   const emailSendCheck = await sendEmailNotify(options);
//       //   if (emailSendCheck) {
//       //     const notifyUser = contractorId;
//       //     const message = `${options.subject}Project Name - ${options.projectName},Description - ${options.projectDescription}`;
//       //     const status = "unseen";
//       //     const type = "project";
//       //     storeNotification(message, notifyUser, status, type);
//       //     // io.emit("emailSent", { userId: notifyUser });
//       //   }
//       // }
//       // else {
//       //   const updatedAssignedAgent = updatedProject.assignedAgent;
//       //   const newAssignedAgent = updatedAssignedAgent.filter((updatedAgent) => {
//       //     return !previousAssignedAgent.some((previousAgent) =>
//       //       previousAgent?.agentId?.equals(updatedAgent.agentId)
//       //     );
//       //   });

//       //   const filterAgentIds = newAssignedAgent.map((agent) =>
//       //     agent?.agentId?.toString()
//       //   );
//       //   const agentEmails = await User.find(
//       //     { _id: { $in: filterAgentIds } },
//       //     "email"
//       //   );

//       //   const agentEmailList = agentEmails.map((agent) => agent.email);

//       //   const toUserIds = [...filterAgentIds, contractorId];

//       //   const options = {
//       //     to: [...agentEmailList, user.email],
//       //     subject: "New Project Assigned ✔",
//       //     template: "ASSIGN-PROJECT",
//       //     projectName: updatedProject.projectName,
//       //     projectDescription: updatedProject.projectDescription,
//       //     user,
//       //   };
//       //   const emailSendCheck = await sendEmailNotify(options);

//       //   if (emailSendCheck) {
//       //     for (const userId of toUserIds) {
//       //       console.log("userId", userId)
//       //       const notifyUser = userId;
//       //       const message = `${options.subject}Project Name - ${options.projectName},Description - ${options.projectDescription}`;
//       //       const status = "unseen";
//       //       const type = "project";
//       //       storeNotification(message, notifyUser, status, type);

//       //     }
//       //   }

//       //   for (const agentId of agentIds) {
//       //     const existingConversation = await Conversation.findOne({
//       //       members: [agentId, contractorId],
//       //       projectId: projectId,
//       //     });
//       //     console.log("existingConversation", existingConversation)
//       //     if (!existingConversation) {
//       //       const newConversation = new Conversation({
//       //         members: [agentId, contractorId],
//       //         projectId: projectId,
//       //       });
//       //       const con = await newConversation.save();

//       //     } else {

//       //     }
//       //   }
//       //   for (const agentId of agentIds) {
//       //     const agentEmail = await User.findById(agentId, "email");
//       //     const newCustomEmail = new CustomEmail({
//       //       projectId: projectId,
//       //       contractorEmail: user.email,
//       //       contractorCustomEmail: `${contractorId}${projectId}${new Date()
//       //         .toISOString()
//       //         .replace(/[^0-9]/g, "")}`,
//       //       agentEmail: agentEmail.email,
//       //       agentCustomEmail: `${agentId}${projectId}${new Date()
//       //         .toISOString()
//       //         .replace(/[^0-9]/g, "")}`,
//       //     });
//       //     await newCustomEmail.save();

//       //   }
//       // }
//       // res.status(200).json({ updatedProject, agent: user });
//     } catch (error) {
//       console.error("Error assigning the project:", error);
//       res.status(500).json({ error: "Error assigning the project" });
//     }
//   })
// );


projectRouter.put(
  "/assign-update/:id",
  isAuth,
  isAdminOrSelf,
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ error: "Access denied" });
      }
      const projectId = req.params.id;
      const previousProject = await Project.findById(projectId);
      const previousAssignedAgent = previousProject.assignedAgent;
      const contractorId = req.body.projectOwner;
      const assignedAgent = req.body.assignedAgent;
      const agentIds = assignedAgent
        .filter((agent) => agent.agentId)
        .map((agent) => agent.agentId);

      const user = await User.findById(contractorId, "first_name email");
      const contractorOnly = !agentIds.length;
      function capitalizeFirstLetter(data) {
        return data.charAt(0).toUpperCase() + data.slice(1);
      }
      const updateFields = {
        assignedAgent,
        projectName: capitalizeFirstLetter(req.body.projectName),
        projectDescription: capitalizeFirstLetter(req.body.projectDescription),
        createdDate: req.body.createdDate,
        endDate: req.body.endDate,
        projectStatus: req.body.projectStatus,
        projectOwner: contractorId,
      };

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { $set: updateFields },
        { new: true }
      );

      if (contractorOnly) {
        const options = {
          to: user.email,
          subject: "New Project Assigned ✔",
          template: "ASSIGN-PROJECT",
          projectName: updatedProject.projectName,
          projectDescription: updatedProject.projectDescription,
          user,
        };
        const emailSendCheck = await sendEmailNotify(options);
        if (emailSendCheck) {
          const notifyUser =  user.email;
          const message = `Your project is updated ${options.projectName}`;
          const status = "unseen";
          const type = "project";
          storeNotification(message, notifyUser, status, type);
          socket.emit("notifyProjectBackend", notifyUser, message);
        }
      }
      else {
        const updatedAssignedAgent = updatedProject.assignedAgent;
        const newAssignedAgent = updatedAssignedAgent.filter((updatedAgent) => {
          return !previousAssignedAgent.some((previousAgent) =>
            previousAgent?.agentId?.equals(updatedAgent.agentId)
          );
        });

        const filterAgentIds = newAssignedAgent.map((agent) =>
          agent?.agentId?.toString()
        );
        const agentEmails = await User.find(
          { _id: { $in: filterAgentIds } },
          "email"
        );

        const agentEmailList = agentEmails.map((agent) => agent.email);

        const toUserIds = [...filterAgentIds, contractorId];

        const options = {
          to: [...agentEmailList, user.email],
          subject: "New Project Assigned ✔",
          template: "ASSIGN-PROJECT",
          projectName: updatedProject.projectName,
          projectDescription: updatedProject.projectDescription,
          user,
        };
        const emailSendCheck = await sendEmailNotify(options);
        if (emailSendCheck) {
          for (const userId of toUserIds) {
            if(userId !== undefined){
            const notifyUser = userId;
            const message = `New Project Assigned Project Name - ${options.projectName},Description - ${options.projectDescription}`;
            const status = "unseen";
            const type = "project";

            storeNotification(message, notifyUser, status, type);
            socket.emit("notifyProjectBackend", notifyUser, message);

          }
          }
        }
        for (const agentId of agentIds) {
          const existingConversation = await Conversation.findOne({
            members: [agentId, contractorId],
            projectId: projectId,
          });
          console.log("existingConversation", existingConversation)
          if (!existingConversation) {
            const newConversation = new Conversation({
              members: [agentId, contractorId],
              projectId: projectId,
            });
            const con = await newConversation.save();

          } else {

          }
        }
        for (const agentId of agentIds) {
          const agentEmail = await User.findById(agentId, "email");
          const newCustomEmail = new CustomEmail({
            projectId: projectId,
            contractorEmail: user.email,
            contractorCustomEmail: `${contractorId}${projectId}${new Date()
              .toISOString()
              .replace(/[^0-9]/g, "")}`,
            agentEmail: agentEmail.email,
            agentCustomEmail: `${agentId}${projectId}${new Date()
              .toISOString()
              .replace(/[^0-9]/g, "")}`,
          });
          await newCustomEmail.save();

        }
      }
      res.status(200).json({ updatedProject, agent: user });
    } catch (error) {
      console.error("Error assigning the project:", error);
      res.status(500).json({ error: "Error assigning the project" });
    }
  })
);

export default projectRouter;

// projectRouter.put(
//   '/assign-update/:id',
//   isAuth,
//   isAdminOrSelf,
//   expressAsyncHandler(async (req, res) => {
//     try {
//       console.log(req.user.role)
//       if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
//         return res.status(403).json({ error: 'Access denied' });
//       }
//       else {
//         const projectId = req.params.id;
//         const contractorId = req.body.projectOwner;
//         const assignedAgent = req.body.assignedAgent;
//         const agentIds = assignedAgent.map((agent) => agent.agentId);
//         console.log("agentIds", agentIds);
//         const user = await User.findById(contractorId, 'first_name email');

//         // const projectId = req.params.id;
//         // const agentId = req.body.agentId;
//         // const categoryId = req.body.categoryId;
//         // const category = await Category.findById(categoryId);
//         // const user = await User.findById(agentId, '_id first_name email');

//         const updateFields = {

//           assignedAgent,

//           projectName: req.body.projectName,
//           projectDescription: req.body.projectDescription,
//           projectCategory: req.body.projectCategory,
//           createdDate: req.body.createdDate,
//           endDate: req.body.endDate,
//           projectStatus: req.body.projectStatus,
//           projectOwner: contractorId,
//         };
//         console.log("updateFields", updateFields)

//         const updatedProject = await Project.findByIdAndUpdate(
//           projectId,
//           { $set: updateFields }, // Use $set to update the specified fields
//           { new: true }
//         );
//         const agentEmails = await User.find({ _id: { $in: agentIds } }, 'email');
//         const agentEmailList = agentEmails.map((agent) => agent.email);
//         const options = {
//           to: agentEmailList,
//           subject: 'New Project Assigned ✔',
//           template: 'ASSIGN-PROJECT',
//           projectName: updatedProject.projectName,
//           projectDescription: updatedProject.projectDescription,
//           user,
//         };

//         await sendEmailNotify(options);

//         for (const agentId of agentIds) {
//           const newConversation = new Conversation({
//             members: [agentId, contractorId],
//             projectId: projectId,
//           });

//           await newConversation.save();
//         }

//         res.status(200).json({ updatedProject, agent: user });
//       }
//     } catch (error) {
//       console.error('Error assigning the project:', error);
//       res.status(500).json({ error: 'Error assigning the project' });
//     }
//   })
// );