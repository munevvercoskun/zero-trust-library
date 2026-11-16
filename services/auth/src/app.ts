//app is the entry point for the auth service.
// It sets up the express app and configures the routes and middleware.
// The app is exported for use in the tests.
//every request to the API is checked against docs/openapi.yaml, and errors never reveal internal details.
// Uses OpenApiValidator to validate the requests and responses against the OpenAPI spec. The OpenAPI spec is in docs/openapi.yaml.

import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import type {Pool} from 'pg';
import * as OpenApiValidator from "express-openapi-validator";   // OpenApiValidator is used to validate the requests and responses against the OpenAPI spec.
import { fileURLToPath } from "node:url"; // fileURLToPath is used to convert the file URL to a path.


export function createApp(pool?: Pool): express.Application {

    const app = express();
    const specPath = fileURLToPath(new URL("../../../docs/openapi.yaml", import.meta.url));
    type HttpError = { status?: number; message?: string };

    const CODES: Record<number, string> = {
        400: "bad_request",
        404: "not_found",
        413: "payload_too_large",
    };

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
    app.use(OpenApiValidator.middleware({
        apiSpec: specPath,
        validateRequests: true,
        validateResponses: true,
        validateSecurity: false, // Disable security validation for now, as we are not using it yet. will turn it on when we implement auth and ccreate the tokens.
    }));

    //error-handling middleware for OpenApiValidator. Any error from the validator, express.json or a route ends up here.
    // The error is logged and a generic error message is sent to the client. The error message does not reveal any internal details.

    app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => { //_next must be there to have 4 parameters to have this function as an error handler.
        const status = err.status || 500;

        if (status >= 500) {
            console.error(err); // full details stay on the server
            res.status(500).json({ error: { code: "internal_error", message: "Internal server error" } });
            return;
        }

        res.status(status).json({
            error: { code: CODES[status] ?? "request_error", message: err.message ?? "Request error" },
        });
    });

    return app;
}
