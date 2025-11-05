import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, FileText, Microscope, Shield, TrendingUp } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: FileText,
      title: 'Research Publications',
      description: 'Access thousands of peer-reviewed medical research papers and studies.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Microscope,
      title: 'Clinical Trials',
      description: 'Find and participate in cutting-edge clinical trials near you.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with researchers, patients, and healthcare professionals.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Shield,
      title: 'Verified Information',
      description: 'All content is verified by medical professionals and researchers.',
      color: 'bg-red-100 text-red-600',
    },
  ];

  const stats = [
    { label: 'Research Papers', value: '10,000+' },
    { label: 'Clinical Trials', value: '5,000+' },
    { label: 'Active Users', value: '50,000+' },
    { label: 'Medical Conditions', value: '500+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Advancing Healthcare Through Research
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Connect with groundbreaking clinical trials, access peer-reviewed publications,
                and join a community dedicated to advancing medical science.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-lg hover:shadow-xl text-center">
                  Get Started <ArrowRight className="inline ml-2" />
                </Link>
                <Link to="/trials" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200 text-center">
                  Browse Trials
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-slide-up">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold mb-2">{stat.value}</div>
                      <div className="text-blue-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose MedResearch?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive platform for medical research, clinical trials,
              and community engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 hover:scale-105 transition duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting started is easy. Follow these simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Create Account
              </h3>
              <p className="text-gray-600">
                Sign up as a patient or researcher to access our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Search & Discover
              </h3>
              <p className="text-gray-600">
                Browse publications, trials, and connect with experts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Participate & Contribute
              </h3>
              <p className="text-gray-600">
                Join trials, share insights, and advance medical research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and researchers working together to advance medical science.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Join Now - It's Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;