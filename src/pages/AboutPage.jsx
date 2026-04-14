export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About UXPilot</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're revolutionizing the design industry with AI-powered tools that make professional 
            design accessible to everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At UXPilot, we believe great design should be accessible to everyone. Our mission is to 
              democratize the design process by leveraging artificial intelligence to help designers, 
              developers, and entrepreneurs create beautiful, functional user experiences.
            </p>
            <p className="text-gray-600">
              We're building the future of design tools, where creativity meets intelligence to produce 
              exceptional results in a fraction of the time.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-8 rounded-xl">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Innovation First</h3>
              <p className="text-gray-600">
                Pushing the boundaries of what's possible in design automation
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">Constantly pushing creative boundaries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">Building tools that bring teams together</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">Making design faster without compromise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}