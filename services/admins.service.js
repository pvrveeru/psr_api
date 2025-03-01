const Admin = require("../models/admins"); // Adjust the path as needed
// const Booking = require("../models/bookings"); // Adjust the path as needed
const User = require("../models/user"); // Adjust the path as needed
// const Event = require("../models/events"); // Adjust the path as needed

const { Sequelize, DataTypes, Op, sql } = require("@sequelize/core");
const { status: httpStatus } = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
// const PaymentDetails = require("../models/paymentDetails");
// const Bookings = require("../models/bookings");
const createJwtToken = require("../middlewares/createJwtToken");
// Service to create an admin
const createAdmin = async (adminData) => {
  try {
    const admin = await Admin.create(adminData);
    return admin;
  } catch (error) {
    if (error instanceof Sequelize.UniqueConstraintError) {
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "Data already exists"
      );
    } else {
      logger.error(
        "Error :: admins.service :: createAdmin :: " + error.stack ||
          error.message
      );
      if (error.statusCode) {
        throw error;
      } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }
  }
};

// Service to get an admin by ID
const getAdminById = async (adminId) => {
  try {
    const admin = await Admin.findByPk(adminId, { raw: true });
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  } catch (error) {
    logger.error(
      "Error :: admins.service :: getAdminById :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to update an admin
const updateAdmin = async (adminId, updatedData) => {
  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }
    await admin.update(updatedData);
    return admin;
  } catch (error) {
    logger.error(
      "Error :: admins.service :: updateAdmin :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to delete an admin
const deleteAdmin = async (adminId) => {
  try {
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
    }
    await admin.destroy();
    return { message: "Admin deleted successfully" };
  } catch (error) {
    logger.error(
      "Error :: admins.service :: deleteAdmin :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

// Service to get all admins (optional)
// const getSummaryData = async (filters = {}) => {
//   try {
//     const { eventName, startDate, endDate, eventId } = filters;
//     // Build event filter conditions
//     const eventWhereConditions = {};
//     const bookingConditions = {};
//     if (eventName) {
//       eventWhereConditions.title = eventName; // Filter by event name
//     }
//     if (eventId) {
//       eventWhereConditions.eventId = eventId; // Filter by event name
//     }
//     // if (startDate || endDate) {
//     //   eventWhereConditions.eventDate = {
//     //     ...(startDate ? { [Op.gte]: startDate } : {}),
//     //     ...(endDate ? { [Op.lte]: endDate } : {}),
//     //   }; // Filter by date range
//     // }
//     if (startDate && endDate) {
//       bookingConditions.bookingDate = {
//         [Op.between]: [filters.startDate, filters.endDate], // Range filter for event dates
//       };
//     }
//     // Total Bookings with event filters
//     const totalBookings = await Booking.count({
//       include: [
//         {
//           model: Event,
//           where: eventWhereConditions, // Filter by event details
//           attributes: [], // No need to fetch event details, just count bookings
//         },
//       ],
//       where: bookingConditions,
//     });

//     // Today's Users with event filters
//     const users = await Booking.count({
//       include: [
//         {
//           model: User,
//           attributes: [], // No need to fetch user details, only count
//         },
//         {
//           model: Event,
//           where: eventWhereConditions, // Apply event filters
//           attributes: [], // Exclude event details
//         },
//       ],
//       where: bookingConditions,
//       distinct: true, // Count distinct users
//       col: "user_id", // Column to count distinct users
//     });

//     // Total Revenue with event filters
//     const totalRevenue = await PaymentDetails.sum("transactionAmount", {
//       where: {
//         transactionStatus: "success", // Only successful transactions
//       },
//       include: [
//         {
//           model: Bookings,
//           required: true, // Inner join to ensure only matching records
//           attributes: [], // Exclude Booking attributes from the result
//           where: {}, // Optional filters for the Bookings table
//         },
//       ],
//     });

//     return {
//       totalBookings,
//       users,
//       totalRevenue: totalRevenue || 0, // Return 0 if no transactions
//     };
//   } catch (error) {
//     logger.error(
//       "Error :: admins.service :: getSummaryData :: " + error.stack ||
//         error.message
//     );
//     if (error.statusCode) {
//       throw error;
//     } else {
//       throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//     }
//   }
// };
// Service to get all admins (optional)
const getAllAdmins = async () => {
  try {
    const admins = await Admin.findAll();
    return admins;
  } catch (error) {
    logger.error(
      "Error :: admins.service :: getAllAdmins :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
const authenticateAdmin = async (username, password) => {
  try {
    const admin = await Admin.findOne({ where: { username }, raw: true });
    if (!admin) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid username or password."
      );
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    // const isPasswordValid = admin?.passwordHash === password;
    if (!isPasswordValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid username or password."
      );
    }

    // Generate a JWT token

    const token = await createJwtToken({
      data: { userId: admin.adminId, username: admin.username, role: "admin" },
      expiresIn: "1h",
    });
    return { token, ...admin };
  } catch (error) {
    logger.error(
      "Error :: admins.service :: authenticateAdmin :: " + error.stack ||
        error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
// Service to get a user by ID ,username
const getAdmin = async (id, username) => {
  try {
    const admin = await Admin.findOne({
      where: { adminId: id, username },
      raw: true,
    });
    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
    }
    return admin;
  } catch (error) {
    logger.error(
      "Error :: admins.service :: getAdmin :: " + error.stack || error.message
    );
    if (error.statusCode) {
      throw error;
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};
module.exports = {
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllAdmins, // Optional
  authenticateAdmin,
  getAdmin,
  // getSummaryData,
};
