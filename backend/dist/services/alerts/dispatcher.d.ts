export type AlertType = 'deploy_failure' | 'down' | 'degraded';
export declare function dispatchAlert(projectId: string, serviceId: string | undefined, alertType: AlertType, message: string): Promise<void>;
//# sourceMappingURL=dispatcher.d.ts.map