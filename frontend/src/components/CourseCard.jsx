import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold tracking-wide uppercase">
            {course.category}
          </span>
        </div>
        
        <h3 className="mt-2 text-xl font-bold text-gray-900 mb-2 truncate" title={course.title}>
          {course.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {course.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100">
           <div className="flex flex-wrap gap-1 mb-4">
             {course.tags && course.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                   {tag}
                </span>
             ))}
             {course.tags && course.tags.length > 3 && (
                 <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                   +{course.tags.length - 3} more
                </span>
             )}
           </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">
              By {course.instructorId?.name || 'Instructor'}
            </span>
            <Link
              to={`/course/${course._id}`}
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              View Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;