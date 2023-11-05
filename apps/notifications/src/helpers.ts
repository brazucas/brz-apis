export const areaCodes = [
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "21",
  "22",
  "24",
  "27",
  "28",
  "31",
  "32",
  "33",
  "34",
  "35",
  "37",
  "38",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "51",
  "53",
  "54",
  "55",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "71",
  "73",
  "74",
  "75",
  "77",
  "79",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
];

export const mailValidation = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
export const phoneValidation = new RegExp(/^\d{11,13}$/);

export const acceptedMailDomains = [
  "gmail.com",
  "hotmail.com",
  "yahoo.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "yahoo.com.br",
];

export const generateCode = (digits = 4) =>
  Math.round(Math.random() * 9999)
    .toString()
    .padStart(digits, "0");

export const addSeconds = (date: Date, seconds: number) => {
  const newDate = new Date(date);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  return newDate;
};
