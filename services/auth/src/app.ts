//app is the entry point for the auth service.
// It sets up the express app and configures the routes and middleware.
// The app is exported for use in the tests.


import express, { type Request, type Response } from "express";
import helmet from "helmet";
import {Pool} from 'pg';




export function createApp(pool?: Pool): express.Application {

    const app = express();

    app.use(helmet());
    app.use(express.json({ limit: "10kb" }));

    app.get("/health", (_req: Request, res: Response) => {
        res.status(200).json({ status: "ok" });
    });

    app.get("/ready", async (_req: Request, res: Response) => {
        if (!pool) {
            res.status(503).json({ status: "unavailable" });
            return;
        }
        try {
                await pool.query("SELECT 1");
                res.json({ status: "ready" });
            } catch {
                res.status(503).json({ status: "unavailable" });
            }
    });

    return app;
}
