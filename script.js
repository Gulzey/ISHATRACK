const API_URL = 'http://api.aladhan.com/v1/timingsByCity';
const CITY = 'London';
const COUNTRY = 'United Kingdom';
const METHOD = 2; // Islamic Society of North America (ISNA)

const fetchPrayerTimes = async (date) => {
    try {
      const response = await axios.get('/api/prayerTimes', {
        params: {
          date: date,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      return null;
    }
  };

const getPrayerTimes = async (date) => {
    try {
        const response = await axios.get(API_URL, {
            params: {
                city: CITY,
                country: COUNTRY,
                method: METHOD,
                date: date,
            },
        });
        return response.data.data.timings;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
};

const calculateHalfwayTime = (startTime, endTime) => {
    const startDate = new Date(`1970-01-01T${startTime}Z`);
    const endDate = new Date(`1970-01-02T${endTime}Z`); // Next day
    const difference = endDate - startDate;
    const halfway = new Date(startDate.getTime() + difference / 2);

    const hours = String(halfway.getUTCHours()).padStart(2, '0');
    const minutes = String(halfway.getUTCMinutes()).padStart(2, '0');
    const seconds = String(halfway.getUTCSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
};

const main = async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = today.toISOString().split('T')[0];
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const todayTimings = await getPrayerTimes(todayDate);
    const tomorrowTimings = await getPrayerTimes(tomorrowDate);

    if (todayTimings && tomorrowTimings) {
        const maghribTime = todayTimings.Maghrib;
        const fajrTime = tomorrowTimings.Fajr;

        const halfwayTime = calculateHalfwayTime(maghribTime, fajrTime);
        console.log(`Halfway time between Maghrib today (${maghribTime}) and Fajr tomorrow (${fajrTime}) is ${halfwayTime}.`);
        document.getElementById('halfway-time').textContent = halfwayTime;
    } else {
        console.error('Unable to fetch prayer times.');
        document.getElementById('halfway-time').textContent = 'Error 404';
    }
};

main();
