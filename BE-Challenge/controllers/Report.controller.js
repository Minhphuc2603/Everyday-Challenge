import Report from '../models/Report.js';


const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('challengeID').populate('reportedBy').exec();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate('challengeID').populate('reportedBy').exec();
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};

const createReport = async (req, res) => {
    try {
      const { challengeID } = req.params;
      const reportData = req.body;
      reportData.challengeID = challengeID;
  
      const newReport = new Report(reportData);
      const result = await newReport.save();
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        message: error.toString(),
      });
    }
  };  

const deleteReport = async (req, res) => {
  const { id } = req.params;
  console.log('Report deleted:', id);
  try {
    
    const result = await Report.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.toString(),
    });
  }
};



export default { getAllReports, getReportById, createReport, deleteReport };