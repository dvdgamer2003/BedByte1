import { Response } from 'express';
import ChatHistory from '../models/ChatHistory';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const generatePrescriptionPDF = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!._id;

    const chatSession = await ChatHistory.findOne({
      userId,
      sessionId,
    }).populate('userId', 'name email phone');

    if (!chatSession) {
      throw new AppError('Chat session not found', 404);
    }

    if (chatSession.prescriptions.length === 0) {
      throw new AppError('No prescriptions found in this session', 404);
    }

    // Generate HTML for PDF
    const html = generatePrescriptionHTML(chatSession);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="prescription-${sessionId.slice(0, 8)}.html"`
    );

    res.send(html);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to generate prescription', 500);
  }
};

function generatePrescriptionHTML(chatSession: any): string {
  const user = chatSession.userId;
  const date = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let prescriptionsHTML = '';
  chatSession.prescriptions.forEach((prescription: any, index: number) => {
    const status = prescription.approvedByDoctor
      ? '<span style="color: green;">✓ Approved by Doctor</span>'
      : '<span style="color: orange;">⏳ Pending Doctor Review</span>';

    prescriptionsHTML += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${index + 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${prescription.medicine}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${prescription.dosage}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${prescription.frequency}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${prescription.duration}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${prescription.purpose}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${status}</td>
      </tr>
    `;
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Prescription</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 40px;
      background: #f9fafb;
    }
    .prescription {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0;
      font-size: 32px;
    }
    .header p {
      color: #6b7280;
      margin: 5px 0;
    }
    .patient-info {
      background: #eff6ff;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .patient-info h2 {
      color: #1e40af;
      font-size: 18px;
      margin-top: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    .disclaimer {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin-top: 30px;
      border-radius: 4px;
    }
    .disclaimer h3 {
      color: #92400e;
      margin-top: 0;
      font-size: 16px;
    }
    .disclaimer p {
      color: #78350f;
      margin: 5px 0;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    @media print {
      body {
        background: white;
        margin: 0;
        padding: 20px;
      }
      .prescription {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="prescription">
    <div class="header">
      <h1>🏥 GetBeds+ Medical Prescription</h1>
      <p>AI-Assisted Healthcare Platform</p>
      <p style="font-size: 14px; color: #9ca3af;">Generated on ${date}</p>
    </div>

    <div class="patient-info">
      <h2>Patient Information</h2>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
      <p><strong>Session ID:</strong> ${chatSession.sessionId}</p>
      ${chatSession.symptoms && chatSession.symptoms.length > 0 ? `<p><strong>Reported Symptoms:</strong> ${chatSession.symptoms.join(', ')}</p>` : ''}
      ${chatSession.severity ? `<p><strong>Severity:</strong> ${chatSession.severity.toUpperCase()}</p>` : ''}
    </div>

    <h2 style="color: #1e40af; margin-top: 30px;">Prescribed Medications</h2>
    
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Medicine</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
          <th>Purpose</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${prescriptionsHTML}
      </tbody>
    </table>

    <div class="disclaimer">
      <h3>⚠️ Important Medical Disclaimer</h3>
      <p><strong>This prescription is AI-generated and for informational purposes only.</strong></p>
      <p>• Always consult a licensed healthcare professional before taking any medication</p>
      <p>• This prescription should be reviewed and approved by a qualified doctor</p>
      <p>• Do not self-medicate or change dosages without medical supervision</p>
      <p>• In case of emergency, immediately contact emergency services or visit the nearest hospital</p>
      <p>• GetBeds+ is not responsible for any adverse effects from self-medication</p>
    </div>

    ${chatSession.reviewedBy ? `
      <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin-top: 30px;">
        <h3 style="color: #065f46; margin-top: 0;">✓ Doctor Reviewed</h3>
        <p style="color: #047857;"><strong>Reviewed by:</strong> Dr. ${chatSession.reviewedBy.name || 'Medical Professional'}</p>
        <p style="color: #047857;"><strong>Review Date:</strong> ${new Date(chatSession.reviewedAt).toLocaleDateString('en-IN')}</p>
      </div>
    ` : ''}

    <div class="footer">
      <p><strong>GetBeds+ Healthcare Platform</strong></p>
      <p>Advanced Hospital Management & AI Medical Assistance</p>
      <p>This is a computer-generated prescription. For questions, contact your healthcare provider.</p>
    </div>
  </div>
</body>
</html>
  `;
}
