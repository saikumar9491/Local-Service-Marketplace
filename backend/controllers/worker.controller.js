import Worker from '../models/Worker.js';

export const registerWorker = async (req, res) => {
  try {
    const { serviceType, experienceYears, hourlyRate, coordinates } = req.body;
    
    // Check if user is already a worker
    const existingWorker = await Worker.findOne({ userId: req.user._id });
    if (existingWorker) {
      return res.status(400).json({ error: "You have already registered as a worker" });
    }

    if (!coordinates || coordinates.length !== 2) {
        return res.status(400).json({ error: "Valid Location coordinates [longitude, latitude] are required" });
    }

    const newWorker = new Worker({
      userId: req.user._id,
      serviceType,
      experienceYears,
      hourlyRate,
      status: 'pending',
      location: {
          type: 'Point',
          coordinates: coordinates // [longitude, latitude]
      }
    });

    await newWorker.save();
    res.status(201).json(newWorker);

  } catch (error) {
    console.log("Error in registerWorker controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPendingWorkers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }

    const pendingWorkers = await Worker.find({ status: 'pending' }).populate('userId', 'name email');
    res.status(200).json(pendingWorkers);
  } catch (error) {
    console.log("Error in getPendingWorkers controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const approveWorker = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }
        
        const { workerId } = req.params;
        const worker = await Worker.findByIdAndUpdate(workerId, { status: 'approved' }, { new: true });
        
        if (!worker) {
            return res.status(404).json({ error: "Worker not found" });
        }
        
        res.status(200).json(worker);
    } catch (error) {
        console.log("Error in approveWorker controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const rejectWorker = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: Admin access only" });
        }
        
        const { workerId } = req.params;
        const worker = await Worker.findByIdAndUpdate(workerId, { status: 'rejected' }, { new: true });
        
        if (!worker) {
            return res.status(404).json({ error: "Worker not found" });
        }
        
        res.status(200).json(worker);
    } catch (error) {
        console.log("Error in rejectWorker controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getNearbyWorkers = async (req, res) => {
    try {
        const { lng, lat, serviceType } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ error: "Longitude and latitude are required" });
        }

        const query = {
            status: 'approved',
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 10000 // 10km in meters
                }
            }
        };

        if (serviceType) {
            query.serviceType = serviceType;
        }

        const workers = await Worker.find(query).populate('userId', 'name email');
        
        res.status(200).json(workers);

    } catch (error) {
        console.log("Error in getNearbyWorkers controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
