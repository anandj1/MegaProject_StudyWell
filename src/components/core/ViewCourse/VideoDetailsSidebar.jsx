import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    console.log("VideoDetailsSidebar useEffect: courseSectionData:", courseSectionData);
    if (!courseSectionData.length) return;
    const currentSection = courseSectionData.find(
      (course) => course._id === sectionId
    );
    if (!currentSection) {
      console.log("No section found for sectionId:", sectionId);
      return;
    }
    const activeSubSection = currentSection.subSection.find(
      (data) => data._id === subSectionId
    );
    setActiveStatus(currentSection._id);
    setVideoBarActive(activeSubSection?._id);
  }, [courseSectionData, sectionId, subSectionId]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-purple-500 bg-purple-600">
      <div className="mx-5 flex flex-col items-start justify-between gap-2 py-5 border-b border-purple-500 text-lg font-bold text-white">
        <div className="flex w-full items-center justify-between">
          <div
            onClick={() => {
              console.log("Back button clicked");
              navigate(`/dashboard/enrolled-courses`);
            }}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white text-black hover:scale-90 cursor-pointer"
            title="back"
          >
            <IoIosArrowBack size={30} />
          </div>
          <IconBtn text="Add Review" onclick={() => setReviewModal(true)} />
        </div>
        <div className="flex flex-col">
          <p>{courseEntireData?.courseName}</p>
          <p className="text-sm font-semibold text-white">
            {completedLectures?.length} / {totalNoOfLectures}
          </p>
        </div>
      </div>

      <div className="h-[calc(100vh-5rem)] overflow-y-auto">
        {courseSectionData.map((course, index) => (
          <div
            className="mt-2 cursor-pointer text-sm text-white"
            onClick={() => {
              console.log("Section clicked:", course._id);
              setActiveStatus(course._id);
            }}
            key={index}
          >
            {/* Section */}
            <div className="flex flex-row justify-between bg-purple-600 px-5 py-4">
              <div className="w-[70%] font-semibold">{course?.sectionName}</div>
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    activeStatus === course._id ? "rotate-0" : "rotate-180"
                  } transition-all duration-500`}
                >
                  <BsChevronDown />
                </span>
              </div>
            </div>

            {/* Sub Sections */}
            {activeStatus === course._id && (
              <div className="transition-[height] duration-500 ease-in-out">
                {course.subSection.map((topic, i) => (
                  <div
                    className={`flex gap-3 px-5 py-2 ${
                      videoBarActive === topic._id
                        ? "bg-yellow-200 font-semibold text-purple-800"
                        : "hover:bg-purple-500"
                    }`}
                    key={i}
                    onClick={() => {
                      console.log("SubSection clicked:", topic._id);
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${course._id}/sub-section/${topic._id}`
                      );
                      setVideoBarActive(topic._id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic?._id)}
                      onChange={() => {}}
                    />
                    {topic.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
