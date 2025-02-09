class Logger {
	private static instance: Logger;
	private constructor() {}

	static getInstance() {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}

		return Logger.instance;
	}

	info(message: string, ...optionalParams: unknown[]) {
		console.log(message, ...optionalParams);
	}

	error(message: string) {
		console.error(message);
	}
}

export const logger = Logger.getInstance();
