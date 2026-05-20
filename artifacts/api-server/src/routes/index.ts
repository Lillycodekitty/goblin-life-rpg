import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dailyStateRouter from "./daily-state";
import questsRouter from "./quests";
import journalRouter from "./journal";
import characterRouter from "./character";
import activityRouter from "./activity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dailyStateRouter);
router.use(questsRouter);
router.use(journalRouter);
router.use(characterRouter);
router.use(activityRouter);

export default router;
