import express from 'express';
import { createRoadmap, deleteUserRoadmap, getRoadmap, getUserRoadmap } from '../controller/Roadmap.controller.js';
import { authMiddelware } from '../middelware/Auth.middelware.js';
import { createModule, markModuleComplete } from '../controller/Module.controller.js';

const routes=express.Router();
// roadmap routes
routes.post('/create/roadmap',authMiddelware,createRoadmap);
routes.get('/roadmap/user',authMiddelware,getUserRoadmap);
routes.get('/roadmap/:id',authMiddelware,getRoadmap);
routes.get('/roadmap/delete/:roadmapId',authMiddelware,deleteUserRoadmap);
/// modules routes

routes.get('/:roadmapId/:moduleId',authMiddelware,createModule)
routes.patch("/:roadmapId/:moduleId/complete", authMiddelware, markModuleComplete);
export default routes;