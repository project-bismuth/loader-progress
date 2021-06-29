import chalk from 'chalk';
import ora from 'ora';


type Job = {
	reportName: string;
	text: string;
};

export type LogLevel = 'pretty' | 'simple' | 'off';


const jobs: Job[] = [];
let jobCount = 0;
let doneJobs = 0;

const spinner = ora();
spinner.spinner = {
	interval: 50,
	frames: [
		'◰',
		'◳',
		'◲',
		'◱',
	],
};
spinner.color = 'yellow';
spinner.prefixText = '\n';

let timeout: NodeJS.Timeout;
let mayComplete = false;


function onJobUpdate() {
	spinner.start();
	spinner.text = ` completed ${
		doneJobs
	} of ${
		jobCount
	} jobs, ${jobs.length} currently running\n\n`;
	spinner.text += jobs.map(
		job => (
			`    ${
				chalk.reset( job.text )
			} \t ${
				chalk.gray(
					job.reportName.substring(
						Math.max( 0, job.reportName.length - 80 ),
						job.reportName.length,
					),
				)
			}`
		),
	).join( '\n' );

	clearTimeout( timeout );

	if ( mayComplete && jobs.length === 0 ) {
		spinner.succeed( `completed ${doneJobs} of ${jobCount} jobs` );
		doneJobs = 0;
		jobCount = 0;
	} else {
		// wait for new jobs to come in
		timeout = setTimeout( () => onJobUpdate(), 1000 );
	}

	mayComplete = jobs.length === 0;
}


let logLevel: LogLevel = 'pretty';

export function setLogLevel( level: LogLevel ): void {
	logLevel = level;
}


function completeJob( job: Job ): void {
	if ( jobs.includes( job ) ) {
		jobs.splice( jobs.findIndex( ( j ) => j === job ), 1 );
		doneJobs += 1;
		onJobUpdate();
	}
}


export function trackJob( job: Job ): () => void {
	if ( logLevel === 'pretty' ) {
		if ( !jobs.includes( job ) ) {
			jobs.push( job );
			jobCount += 1;
			onJobUpdate();
		}

		return () => completeJob( job );
	}

	if ( logLevel === 'simple' ) {
		// eslint-disable-next-line no-console
		console.log( `${chalk.reset( job.text )} ${chalk.gray( job.reportName )}` );
	}

	return () => {};
}

