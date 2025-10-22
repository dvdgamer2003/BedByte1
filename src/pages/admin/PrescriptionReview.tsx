import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  User as UserIcon,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pill,
  Edit,
  Save,
} from 'lucide-react';
import api from '../../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Skeleton } from '../../components/ui/skeleton';

interface ChatSession {
  _id: string;
  sessionId: string;
  userId: {
    name: string;
    email: string;
    phone: string;
  };
  symptoms: string[];
  severity: string;
  prescriptions: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    purpose: string;
    approvedByDoctor: boolean;
    doctorNotes?: string;
  }>;
  messages: Array<{
    role: string;
    text: string;
    timestamp: Date;
  }>;
  requiresDoctorReview: boolean;
  status: string;
  createdAt: Date;
}

const PrescriptionReview = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedPrescription, setEditedPrescription] = useState<any>({});

  useEffect(() => {
    fetchChatsForReview();
  }, []);

  const fetchChatsForReview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chatbot/review');
      setChats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPrescription = async (
    sessionId: string,
    prescriptionIndex: number,
    approved: boolean
  ) => {
    try {
      await api.post(`/chatbot/review/${sessionId}`, {
        prescriptionIndex,
        approved,
        notes: editedPrescription.notes || '',
        updatedPrescription: editingIndex === prescriptionIndex ? editedPrescription : null,
      });

      alert('Prescription reviewed successfully!');
      setEditingIndex(null);
      setEditedPrescription({});
      fetchChatsForReview();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to review prescription');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency':
        return 'destructive';
      case 'high':
        return 'warning';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Prescription Review
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve AI-generated prescriptions
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <p className="text-blue-100 mb-2">Pending Review</p>
              <p className="text-4xl font-bold">
                {chats.filter((c) => c.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <p className="text-green-100 mb-2">Reviewed</p>
              <p className="text-4xl font-bold">
                {chats.filter((c) => c.status === 'reviewed').length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <p className="text-red-100 mb-2">High Priority</p>
              <p className="text-4xl font-bold">
                {chats.filter((c) => c.severity === 'high' || c.severity === 'emergency').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sessions */}
        <div className="space-y-6">
          {chats.map((chat) => (
            <motion.div
              key={chat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {chat.userId.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={getSeverityColor(chat.severity)}>
                            {chat.severity?.toUpperCase() || 'N/A'}
                          </Badge>
                          <Badge variant={chat.status === 'reviewed' ? 'default' : 'secondary'}>
                            {chat.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedChat(selectedChat?._id === chat._id ? null : chat)
                      }
                    >
                      {selectedChat?._id === chat._id ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Patient Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{chat.userId.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">
                          {new Date(chat.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Symptoms</p>
                        <p className="font-semibold">
                          {chat.symptoms.length} reported
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {chat.symptoms.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
                      <p className="font-semibold text-gray-900 mb-2">Reported Symptoms:</p>
                      <div className="flex flex-wrap gap-2">
                        {chat.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedChat?._id === chat._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6"
                    >
                      {/* Prescriptions */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Pill className="h-5 w-5 text-blue-600" />
                          AI-Generated Prescriptions
                        </h3>
                        <div className="space-y-4">
                          {chat.prescriptions.map((prescription, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-xl border-2 ${
                                prescription.approvedByDoctor
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {editingIndex === index ? (
                                    <Input
                                      value={
                                        editedPrescription.medicine ||
                                        prescription.medicine
                                      }
                                      onChange={(e) =>
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          medicine: e.target.value,
                                        })
                                      }
                                      className="mb-2"
                                    />
                                  ) : (
                                    prescription.medicine
                                  )}
                                </h4>
                                <div className="flex gap-2">
                                  {!prescription.approvedByDoctor && (
                                    <>
                                      {editingIndex === index ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingIndex(null)}
                                        >
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setEditingIndex(index);
                                            setEditedPrescription(prescription);
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                <div>
                                  <p className="text-gray-600">Dosage:</p>
                                  {editingIndex === index ? (
                                    <Input
                                      value={
                                        editedPrescription.dosage || prescription.dosage
                                      }
                                      onChange={(e) =>
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          dosage: e.target.value,
                                        })
                                      }
                                      className="mt-1"
                                    />
                                  ) : (
                                    <p className="font-semibold">{prescription.dosage}</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-gray-600">Frequency:</p>
                                  {editingIndex === index ? (
                                    <Input
                                      value={
                                        editedPrescription.frequency ||
                                        prescription.frequency
                                      }
                                      onChange={(e) =>
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          frequency: e.target.value,
                                        })
                                      }
                                      className="mt-1"
                                    />
                                  ) : (
                                    <p className="font-semibold">{prescription.frequency}</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-gray-600">Duration:</p>
                                  {editingIndex === index ? (
                                    <Input
                                      value={
                                        editedPrescription.duration ||
                                        prescription.duration
                                      }
                                      onChange={(e) =>
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          duration: e.target.value,
                                        })
                                      }
                                      className="mt-1"
                                    />
                                  ) : (
                                    <p className="font-semibold">{prescription.duration}</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-gray-600">Purpose:</p>
                                  <p className="font-semibold">{prescription.purpose}</p>
                                </div>
                              </div>

                              {!prescription.approvedByDoctor && (
                                <div className="flex gap-3 mt-4">
                                  <Button
                                    onClick={() =>
                                      handleReviewPrescription(chat.sessionId, index, true)
                                    }
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleReviewPrescription(chat.sessionId, index, false)
                                    }
                                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </Button>
                                  {editingIndex === index && (
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleReviewPrescription(chat.sessionId, index, true)
                                      }
                                      className="flex items-center gap-2"
                                    >
                                      <Save className="h-4 w-4" />
                                      Save & Approve
                                    </Button>
                                  )}
                                </div>
                              )}

                              {prescription.approvedByDoctor && (
                                <Badge variant="default" className="mt-3">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approved
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {chats.length === 0 && (
            <Card className="p-16 text-center border-0 shadow-lg">
              <MessageCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Chats to Review</h3>
              <p className="text-gray-500">
                All AI-generated prescriptions have been reviewed.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionReview;
