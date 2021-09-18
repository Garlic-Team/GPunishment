let mutePunishmentTypes = {
    "0001": "Swearing or insulting.",
    "0002": "Religious, national or family swear/insult.",
    "0003": "Disturbing people.",
    "0004": "Flood, spam, or exaggerated capitalization.",
    "0005": "Misuse of channels.",
    "0006": "Other.",
    "0007": "Using a voice changer.",
    "0008": "Turning on bass music and trolling people.",
    "0009": "General trolls.",
    "0010": "Advertising.",
    "0011": "Alt account.",
    "0012": "Harassment, bullying or +18 content sharing.",
    "0013": "Unwanted people or groups.",
    "0014": "Disclosure sharing.",
    "0015": "Other."
  };
  
  let mutePunishmentTimes = {
    normal: {
      "0001": "for 15 minutes",
      "0002": "for 1 hour",
      "0003": "for 10 minutes",
      "0004": "for 5 minutes",
      "0005": "for 10 minutes",
      "0006": "for 15 minutes",
      "0007": "for 15 minutes",
      "0008": "for 1 hour",
      "0009": "for 1 year",
      "0010": "for 1 year",
      "0011": "for 1 year",
      "0012": "for 12 days",
      "0013": "for 1 year",
      "0014": "for 1 year",
      "0015": "for 15 days"
    },
  
    mini: {
      "0001": "15m",
      "0002": "1h",
      "0003": "10m",
      "0004": "5m",
      "0005": "10m",
      "0006": "15m",
      "0007": "15m",
      "0008": "1m",
      "0009": "1y",
      "0010": "1y",
      "0011": "1y",
      "0012": "12d",
      "0013": "1y",
      "0014": "1y",
      "0015": "3d"
    },
  };
  
  let generalPunishentPoints = {
      "0001": 15,
      "0002": 60,
      "0003": 10,
      "0004": 5,
      "0006": 10,
      "0007": 15,
      "0008": 60,
      "0009": 250,
      "0010": 250,
      "0011": 250,
      "0012": 150,
      "0013": 250,
      "0014": 250,
      "0015": 100
  };
  
  /**
   * It translates the reason according to the entered code.
   * @param {string} code Four-digit penalty code.
   * @returns string
   */
  function mutePunishReasonConverter(code) {
    return mutePunishmentTypes[String(code).padStart(4, "0")];
  };
  
  /**
   * It translates the time according to the entered code.
   * @param {string} code Four-digit penalty code.
   * @param {string} type normal/mini
   * @returns string
   */
  function mutePunishEpochConverter(code, type) {
    if (type === "normal") {
      return mutePunishmentTimes.normal[String(code).padStart(4, "0")];
    } else {
      return mutePunishmentTimes.mini[String(code).padStart(4, "0")];
    };
  };
  
  /**
   * It translates the point according to the entered code.
   * @param {string} code Four-digit penalty code.
   * @returns number
   */
  function generalPunishPointConverter(code) {
      return generalPunishentPoints[String(code).padStart(4, "0")];
  };
  
  /**
   * It translates the rank according to the penalty score.
   * @param {number} point Penalty score.
   * @returns string
   */
  function punishmentPointConverter(point) {
    let pointChar;
    if (point >= 0) pointChar = "Angel"
    if (point >= 15) pointChar = "Demonic"
    if (point >= 30) pointChar = "New Bride"
    if (point >= 60) pointChar = "Landlord of Girls"
    if (point >= 120) pointChar = "Sharp Vinegar"
    if (point >= 200) pointChar = "Taupe"
    if (point >= 250) pointChar = "Bedouin"
    if (point >= 300) pointChar = "Yecuc Mecuc"
    if (point >= 350) pointChar = "Voivode"
    if (point >= 400) pointChar = "Disrupting This Beautiful Server"
    if (point >= 600) pointChar = "Interpol Leak"
    if (point >= 1000) pointChar = "Fish Jam"
    if (point >= 1200) pointChar = "Sold his/her Soul to the Devil"
    if (point >= 1500) pointChar = "Devil's Squire"
    if (point >= 2000) pointChar = "Infidel"
  
    return pointChar;
  };
  
  /**
   * It translates according to the BOOLEAN type of punishment.
   * @param {boolean} boolean true/false
   * @returns string
   */
  function punishmentIsEndedConverter(boolean) {
    let result;
    if (boolean == false) result = "Continues"
    if (boolean == true) result = "Ended"
    
    return result;
  }
  
  module.exports.mutePunishReasonConverter = mutePunishReasonConverter;
  module.exports.mutePunishEpochConverter = mutePunishEpochConverter;
  module.exports.generalPunishPointConverter = generalPunishPointConverter;
  module.exports.punishmentPointConverter = punishmentPointConverter;
  module.exports.punishmentIsEndedConverter = punishmentIsEndedConverter;
  