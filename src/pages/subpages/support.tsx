import type { NextPage } from 'next';
import Head from 'next/head';
import React, { JSX, useState } from 'react';
import NavbarPublic from '../../components/NavbarPublic';
import SubNavbar from '../../components/SubNavbar';
import Footer from '@/components/Footer';
import { 
  HelpOutline,
  QuestionAnswer,
  Chat,
  Phone,
  TrackChanges,
  Replay,
  LocalShipping,
  CreditCard,
  Security,
  Build,
  MenuBook,
  Construction,
  BugReport,
  LocationOn,
  Forum,
  Lightbulb,
  OndemandVideo,
  Feedback,
  AccountCircle,
  Lock
} from '@mui/icons-material';
import './Support.css';

interface SupportFeature {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

const supportFeatures: SupportFeature[] = [
  { id: 1, title: 'Help Center', description: 'Find answers to common questions.', icon: <HelpOutline /> },
  { id: 2, title: 'FAQs', description: 'Frequently Asked Questions.', icon: <QuestionAnswer /> },
  { id: 3, title: 'Live Chat', description: 'Chat with our support team in real time.', icon: <Chat /> },
  { id: 4, title: 'Contact Us', description: 'Get in touch with our team.', icon: <Phone /> },
  { id: 5, title: 'Order Tracking', description: 'Track your order status.', icon: <TrackChanges /> },
  { id: 6, title: 'Returns & Refunds', description: 'Learn about our return policies.', icon: <Replay /> },
  { id: 7, title: 'Shipping Info', description: 'Delivery and shipping details.', icon: <LocalShipping /> },
  { id: 8, title: 'Payment Help', description: 'Resolve payment issues.', icon: <CreditCard /> },
  { id: 9, title: 'Warranty Info', description: 'View warranty and service details.', icon: <Security /> },
  { id: 10, title: 'Technical Support', description: 'Get help with technical issues.', icon: <Build /> },
  { id: 11, title: 'Product Manuals', description: 'Download user guides and manuals.', icon: <MenuBook /> },
  { id: 12, title: 'Installation Guides', description: 'Step-by-step installation help.', icon: <Construction /> },
  { id: 13, title: 'Troubleshooting', description: 'Solve common problems.', icon: <BugReport /> },
  { id: 14, title: 'Service Centers', description: 'Locate nearby service centers.', icon: <LocationOn /> },
  { id: 15, title: 'Community Forums', description: 'Join our support community.', icon: <Forum /> },
  { id: 16, title: 'Knowledge Base', description: 'Access detailed support articles.', icon: <Lightbulb /> },
  { id: 17, title: 'Video Tutorials', description: 'Watch helpful tutorials.', icon: <OndemandVideo /> },
  { id: 18, title: 'Feedback', description: 'Share your feedback with us.', icon: <Feedback /> },
  { id: 19, title: 'Account Support', description: 'Assistance with your account.', icon: <AccountCircle /> },
  { id: 20, title: 'Privacy Policy', description: 'Learn about our privacy practices.', icon: <Lock /> },
];

const Support: NextPage = () => {
  const [selectedFeature, setSelectedFeature] = useState<SupportFeature | null>(null);

  const handleCardClick = (feature: SupportFeature) => {
    setSelectedFeature(feature);
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };

  return (
    <div>
      <Head>
        <title>Support - Almar Designs</title>
        <meta name="description" content="Get help and support for your orders" />
      </Head>
      <NavbarPublic />
      <SubNavbar />
      <main className="support-container">
        <h1 className="support-heading">Support</h1>
        <p className="support-description">
          If you have any questions or need assistance, explore our support features below.
        </p>
        <div className="support-grid">
          {supportFeatures.map((feature) => (
            <div
              key={feature.id}
              className="support-card"
              onClick={() => handleCardClick(feature)}
            >
              <div className="support-icon">{feature.icon}</div>
              <h2 className="support-title">{feature.title}</h2>
              <p className="support-text">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
      
      {/* Modal Section */}
      {selectedFeature && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-icon">{selectedFeature.icon}</div>
            <h2 className="modal-title">{selectedFeature.title}</h2>
            <p className="modal-description">{selectedFeature.description}</p>
            {/* Additional content specific to the feature can be added here */}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Support;
