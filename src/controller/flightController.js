const flights = require('../repository/flightList');

module.exports = {
  // [GET] /flight
  // 요청 된 departure_times, arrival_times, destination, departure 값과 동일한 값을 가진 항공편 데이터를 조회합니다.
  findAll: (req, res) => {
    // 쿼리가 있는 GET 요청은, departure_times, arrival_times, destination, departure에 따른 필터
    const { departure_times, arrival_times, destination, departure } =
      req.query;

    const filtered = flights.filter((flight) => {
      if (departure && destination) {
        if (
          flight.departure !== departure ||
          flight.destination !== destination
        ) {
          return false;
        }
      }

      if (departure_times && arrival_times) {
        const flightDepartureTime = new Date(flight.departure_times).getDate();
        const flightArrivalTime = new Date(flight.arrival_times).getDate();
        const queryDepartureTime = new Date(departure_times).getDate();
        const queryArrivalTime = new Date(arrival_times).getDate();

        if (
          flightDepartureTime !== queryDepartureTime ||
          flightArrivalTime !== queryArrivalTime
        ) {
          return false;
        }
      }

      return true;
    });

    // 쿼리가 없는 GET 요청은, 저장된 모든 항공편을 조회합니다.
    return res.status(200).json(filtered);
  },

  // [GET] /flight/:id
  // 요청 된 id 값과 동일한 uuid 값을 가진 항공편 데이터를 조회합니다.
  findById: (req, res) => {
    // TODO:
    const result = flights.filter((flight) => flight.uuid === req.params.id);
    return res.status(200).json(result);
  },

  // [PUT] /flight/:id 요청을 수행합니다.
  // 요청 된 id 값과 동일한 uuid 값을 가진 항공편 데이터를 요쳥 된 Body 데이터로 수정합니다.
  update: (req, res) => {
    // req.params.id와 uuid가 같은 flights의 값을 찾아서
    const data = flights.find((flight) => flight.uuid === req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Not Found' });
    }

    // req.body값으로 수정된 데이터로 변경
    const updatableFields = [
      'departure',
      'destination',
      'departure_times',
      'arrival_times',
    ];
    updatableFields.forEach((field) => {
      if (field in req.body) {
        data[field] = req.body[field];
      }
    });

    return res.status(200).json(data);
  },
};
