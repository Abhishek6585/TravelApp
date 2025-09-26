import { useState } from "react";
import { X, UserCheck, Phone, Mail, MapPin, Plus, Trash2, AlertTriangle, Check, Shield, Heart, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { useTheme } from "../contexts/ThemeContext";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
}

interface EmergencyContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contacts: EmergencyContact[]) => void;
  existingContacts?: EmergencyContact[];
}

export function EmergencyContactModal({ 
  isOpen, 
  onClose, 
  onSave, 
  existingContacts = [] 
}: EmergencyContactModalProps) {
  const { actualTheme } = useTheme();
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    existingContacts.length > 0 
      ? existingContacts 
      : [{
          id: '1',
          name: '',
          phone: '',
          email: '',
          relationship: '',
          isPrimary: true
        }]
  );
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddContact = () => {
    if (contacts.length >= 3) {
      toast.error("Maximum 3 emergency contacts allowed");
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      email: '',
      relationship: '',
      isPrimary: false
    };
    setContacts([...contacts, newContact]);
  };

  const handleRemoveContact = (id: string) => {
    if (contacts.length === 1) {
      toast.error("At least one emergency contact is required");
      return;
    }
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleContactChange = (id: string, field: keyof EmergencyContact, value: any) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const handleSetPrimary = (id: string) => {
    setContacts(contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    })));
  };

  const validateContacts = () => {
    for (const contact of contacts) {
      if (!contact.name.trim()) {
        toast.error("Please enter names for all contacts");
        return false;
      }
      if (!contact.phone.trim()) {
        toast.error("Please enter phone numbers for all contacts");
        return false;
      }
      if (!contact.relationship.trim()) {
        toast.error("Please select relationships for all contacts");
        return false;
      }
    }

    const hasPrimary = contacts.some(contact => contact.isPrimary);
    if (!hasPrimary) {
      toast.error("Please select a primary emergency contact");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateContacts()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    onSave(contacts);
    toast.success("Emergency contacts updated successfully!");
    onClose();
  };

  const relationshipOptions = [
    "Spouse",
    "Parent",
    "Child",
    "Sibling", 
    "Friend",
    "Colleague",
    "Other"
  ];

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const match = cleaned.match(/^(\d{0,5})(\d{0,5})$/);
      if (match) {
        return `+91 ${match[1]}${match[2] ? ' ' + match[2] : ''}`;
      }
    }
    return value;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[90vh] overflow-hidden ${
        actualTheme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${
              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <UserCheck className="w-5 h-5 text-orange-600" />
              Emergency Contacts
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`rounded-full ${
                actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className={`w-4 h-4 ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </Button>
          </div>
          <p className={`text-sm ${
            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Set up trusted contacts who can be reached in case of emergency during travel
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 overflow-y-auto max-h-[60vh]">
          <div className={`p-3 rounded-lg ${
            actualTheme === 'dark' 
              ? 'bg-orange-900/20 border border-orange-800/30' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                actualTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-orange-300' : 'text-orange-800'
                }`}>
                  Important
                </p>
                <p className={`text-xs ${
                  actualTheme === 'dark' ? 'text-orange-200' : 'text-orange-700'
                }`}>
                  These contacts can access your location and travel info during emergencies
                </p>
              </div>
            </div>
          </div>

          {/* Kerala Emergency Services Quick Access */}
          <div className={`p-4 rounded-lg ${
            actualTheme === 'dark' 
              ? 'bg-blue-900/20 border border-blue-800/30' 
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              actualTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'
            }`}>
              Kerala Emergency Services
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'tel:100'}
                className={`h-auto p-2 flex flex-col gap-1 ${
                  actualTheme === 'dark' 
                    ? 'border-blue-600 hover:bg-blue-800/30 text-blue-300' 
                    : 'border-blue-300 hover:bg-blue-100 text-blue-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-xs">Police</span>
                <span className="text-xs font-mono">100</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'tel:108'}
                className={`h-auto p-2 flex flex-col gap-1 ${
                  actualTheme === 'dark' 
                    ? 'border-red-600 hover:bg-red-800/30 text-red-300' 
                    : 'border-red-300 hover:bg-red-100 text-red-700'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="text-xs">Ambulance</span>
                <span className="text-xs font-mono">108</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'tel:+91-484-2371018'}
                className={`h-auto p-2 flex flex-col gap-1 ${
                  actualTheme === 'dark' 
                    ? 'border-green-600 hover:bg-green-800/30 text-green-300' 
                    : 'border-green-300 hover:bg-green-100 text-green-700'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs">Tourist Police</span>
                <span className="text-xs">Kochi</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'tel:1091'}
                className={`h-auto p-2 flex flex-col gap-1 ${
                  actualTheme === 'dark' 
                    ? 'border-purple-600 hover:bg-purple-800/30 text-purple-300' 
                    : 'border-purple-300 hover:bg-purple-100 text-purple-700'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span className="text-xs">Women Help</span>
                <span className="text-xs font-mono">1091</span>
              </Button>
            </div>
          </div>

          {contacts.map((contact, index) => (
            <Card key={contact.id} className={`${
              actualTheme === 'dark' 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-sm flex items-center gap-2 ${
                    actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    Emergency Contact {index + 1}
                    {contact.isPrimary && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        actualTheme === 'dark' 
                          ? 'bg-orange-900/50 text-orange-300' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        Primary
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {!contact.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimary(contact.id)}
                        className="text-xs"
                      >
                        Set Primary
                      </Button>
                    )}
                    {contacts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveContact(contact.id)}
                        className={`w-6 h-6 ${
                          actualTheme === 'dark' 
                            ? 'text-red-400 hover:bg-red-900/30' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`name-${contact.id}`} className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Full Name *
                    </Label>
                    <Input
                      id={`name-${contact.id}`}
                      placeholder="Enter full name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)}
                      className={`h-8 text-sm ${
                        actualTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`relationship-${contact.id}`} className={`text-xs ${
                      actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Relationship *
                    </Label>
                    <Select
                      value={contact.relationship}
                      onValueChange={(value) => handleContactChange(contact.id, 'relationship', value)}
                    >
                      <SelectTrigger className={`h-8 text-sm ${
                        actualTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300'
                      }`}>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipOptions.map((option) => (
                          <SelectItem key={option} value={option.toLowerCase()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`phone-${contact.id}`} className={`text-xs ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className={`absolute left-2 top-2 w-3 h-3 ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <Input
                      id={`phone-${contact.id}`}
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(contact.id, 'phone', formatPhoneNumber(e.target.value))}
                      className={`h-8 text-sm pl-8 ${
                        actualTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`email-${contact.id}`} className={`text-xs ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email Address (Optional)
                  </Label>
                  <div className="relative">
                    <Mail className={`absolute left-2 top-2 w-3 h-3 ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <Input
                      id={`email-${contact.id}`}
                      type="email"
                      placeholder="email@example.com"
                      value={contact.email}
                      onChange={(e) => handleContactChange(contact.id, 'email', e.target.value)}
                      className={`h-8 text-sm pl-8 ${
                        actualTheme === 'dark' 
                          ? 'bg-gray-600 border-gray-500 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {contacts.length < 3 && (
            <Button
              variant="outline"
              onClick={handleAddContact}
              className={`w-full ${
                actualTheme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Contact
            </Button>
          )}
        </CardContent>

        <div className={`p-4 border-t ${
          actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className={`flex-1 ${
                actualTheme === 'dark' 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : ''
              }`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "Saving..." : "Save Contacts"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}