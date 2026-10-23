export default function UpcomingLeavesCard() {

  const holidays = [
    {
      day: "09",
      month: "Aug",
      name: "Raksha Bandhan"
    },
    {
      day: "15",
      month: "Aug",
      name: "Independence Day"
    },
    {
      day: "16",
      month: "Aug",
      name: "Janmashtami"
    }
  ];

  return (

    <div className="bg-white rounded-3xl shadow-sm p-6">

      <h3 className="font-semibold mb-5">
        Upcoming Holidays
      </h3>

      <div className="space-y-5">

        {holidays.map((item,index) => (

          <div
            key={index}
            className="
            flex
            justify-between
            items-center
            "
          >

            <div className="flex gap-4">

              <div>

                <p className="font-bold">
                  {item.day}
                </p>

                <p className="text-xs text-gray-400">
                  {item.month}
                </p>

              </div>

              <div>

                <p className="font-medium">
                  {item.name}
                </p>

              </div>

            </div>

            <span className="text-xs">
              Full Day
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}