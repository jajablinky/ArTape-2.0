const getTimeInMinutes = (input: number): string => {
	let hours = 0;
	let minutes = 0;
	let seconds = Math.trunc(input);

	let modifiedSeconds = '';
	let modifiedMinutes = '';

	while (seconds >= 60) {
		minutes += 1;
		seconds -= 60;
	}
	if (seconds < 10) modifiedSeconds = '0' + seconds;
	else modifiedSeconds = seconds.toString();

	while (minutes >= 60) {
		hours += 1;
		minutes -= 60;
	}
	if (minutes < 10) modifiedMinutes = '0' + minutes;
	else modifiedMinutes = minutes.toString();

	if (hours) return hours + ':' + modifiedMinutes + ':' + modifiedSeconds;
	else return minutes + ':' + modifiedSeconds;
}

export default getTimeInMinutes;