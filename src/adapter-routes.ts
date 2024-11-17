import { DATABASE } from "@commons/tokens";
import { ALLOWED_DB_OPERATIONS } from "@core-engine/core/types";
import { CRUDActionExecutorUsecase } from "@core-engine/usecases/crud-action-executor.usecase";
import { ApplyMigrationUsecase } from "@migrations/apply-migration.usecase";
import { RevertMigrationUsecase } from "@migrations/revert-migration.usecase";
import { Request, Response, Router } from "express";
import { Db } from "mongodb";
import Container from "typedi";
export const adapterRouter = Router();


adapterRouter.patch('/api/v6/database/migrations', async (req: Request, res: Response) => {
    const applyMigrationUsecase = Container.get(ApplyMigrationUsecase)
    await applyMigrationUsecase.execute();
    res.json({})
})

adapterRouter.delete('/api/v6/database/migrations', async (req: Request, res: Response) => {
    const revertMigrationUsecase = Container.get(RevertMigrationUsecase)
    await revertMigrationUsecase.execute();
    res.json({})
})

adapterRouter.get('/api/v6/database/migrations', async (req: Request, res: Response) => {
    const coreEngineUsecase: CRUDActionExecutorUsecase = Container.get(CRUDActionExecutorUsecase);
    const allMigrations = await coreEngineUsecase.execute({
        db: Container.get(DATABASE),
        actionDef: {
            operation: ALLOWED_DB_OPERATIONS.find,
            collectionName: "changelog",
            payload: {
                filter: {},
                options: {}
            }
        }
    })
    res.json({ migrations: allMigrations })
})

adapterRouter.get('/api/v6/database/collections', async (req: Request, res: Response) => {
    const db: Db = Container.get(DATABASE);
    const collectionNames = (await db.listCollections().toArray()).map(collection => collection.name)
    res.json({ collectionNames });
})

adapterRouter.post('/api/v6/database/query', async (req: Request, res: Response) => {
    const coreEngineUsecase: CRUDActionExecutorUsecase = Container.get(CRUDActionExecutorUsecase);
    const result = await coreEngineUsecase.execute({
        actionDef: req.body,
        db: Container.get(DATABASE)
    })
    res.json(result);
})

adapterRouter.get('/api/v6/users', async (req: Request, res: Response) => {
    const coreEngineUsecase: CRUDActionExecutorUsecase = Container.get(CRUDActionExecutorUsecase);
    const allUsers = await coreEngineUsecase.execute({
        db: Container.get(DATABASE),
        actionDef: {
            operation: ALLOWED_DB_OPERATIONS.find,
            collectionName: "users",
            payload: {
                filter: {},
                options: {}
            }
        }
    })
    res.json({ allUsers })
})