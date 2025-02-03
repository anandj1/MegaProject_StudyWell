import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from "video-react"
import "video-react/dist/video-react.css"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isGif = (url) => {
    return url?.toLowerCase().endsWith('.gif')
  }

  useEffect(() => {
    const initializeVideo = async () => {
      try {
        if (!courseSectionData.length) return
        if (!courseId && !sectionId && !subSectionId) {
          navigate(`/dashboard/enrolled-courses`)
          return
        }

        const filteredData = courseSectionData.find(
          (course) => course._id === sectionId
        )
        
        if (!filteredData) {
          setError("Section not found")
          return
        }

        const filteredVideoData = filteredData.subSection.find(
          (data) => data._id === subSectionId
        )

        if (!filteredVideoData) {
          setError("Video not found")
          return
        }

        setVideoData(filteredVideoData)
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
        setError(null)
      } catch (err) {
        setError("Error loading video")
        console.error("Video loading error:", err)
      }
    }

    initializeVideo()
  }, [courseSectionData, courseEntireData, location.pathname])

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex(
      (data) => data._id === subSectionId
    )
    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const noOfSubsections = courseSectionData[currentSectionIndx]?.subSection.length
    const currentSubSectionIndx = courseSectionData[currentSectionIndx]?.subSection.findIndex(
      (data) => data._id === subSectionId
    )
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSection = courseSectionData[currentSectionIndx]
    const noOfSubsections = currentSection.subSection.length
    const currentSubSectionIndx = currentSection.subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId = currentSection.subSection[currentSubSectionIndx + 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
    } else if (currentSectionIndx !== courseSectionData.length - 1) {
      const nextSection = courseSectionData[currentSectionIndx + 1]
      const nextSubSectionId = nextSection.subSection[0]._id
      navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubSectionId}`)
    }
  }

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )
    const currentSection = courseSectionData[currentSectionIndx]
    const currentSubSectionIndx = currentSection.subSection.findIndex(
      (data) => data._id === subSectionId
    )

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId = currentSection.subSection[currentSubSectionIndx - 1]._id
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
    } else if (currentSectionIndx !== 0) {
      const prevSection = courseSectionData[currentSectionIndx - 1]
      const prevSubSectionId = prevSection.subSection[prevSection.subSection.length - 1]._id
      navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSectionId}`)
    }
  }

  const handleLectureCompletion = async () => {
    try {
      setLoading(true)
      const res = await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      )
      if (res) {
        dispatch(updateCompletedLectures(subSectionId))
      }
    } catch (err) {
      console.error("Error marking lecture complete:", err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-2xl text-red-400">{error}</p>
      </div>
    )
  }

  const renderMedia = () => {
    if (!videoData) {
      return (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      )
    }

    if (isGif(videoData.videoUrl)) {
      return (
        <div className="relative">
          <img
            src={videoData.videoUrl}
            alt={videoData.title}
            className="h-full w-full rounded-md object-contain"
          />
          {!completedLectures.includes(subSectionId) && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <IconBtn
                disabled={loading}
                onclick={handleLectureCompletion}
                text={loading ? "Loading..." : "Mark As Completed"}
                customClasses="text-xl max-w-max px-4"
              />
            </div>
          )}
        </div>
      )
    }

    return (
      <Player
        ref={playerRef}
        aspectRatio="16:9"
        playsInline
        onError={(e) => {
          console.error("Video Error:", e)
          setError("Error playing video")
        }}
        onEnded={() => setVideoEnded(true)}
        src={videoData?.videoUrl}
        fluid={true}
      >
        <BigPlayButton position="center" />
        <ControlBar autoHide={true}>
          <PlaybackRateMenuButton rates={[0.5, 1, 1.5, 2]} />
        </ControlBar>

        {videoEnded && (
          <div
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black bg-opacity-70 p-6"
          >
            {!completedLectures.includes(subSectionId) && (
              <IconBtn
                disabled={loading}
                onclick={handleLectureCompletion}
                text={loading ? "Loading..." : "Mark As Completed"}
                customClasses="text-xl max-w-max px-4"
              />
            )}
            <IconBtn
              disabled={loading}
              onclick={() => {
                if (playerRef?.current) {
                  playerRef.current.seek(0)
                  setVideoEnded(false)
                }
              }}
              text="Rewatch"
              customClasses="text-xl max-w-max px-4"
            />
            <div className="mt-4 flex gap-4">
              {!isFirstVideo() && (
                <button
                  disabled={loading}
                  onClick={goToPrevVideo}
                  className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
                >
                  Previous
                </button>
              )}
              {!isLastVideo() && (
                <button
                  disabled={loading}
                  onClick={goToNextVideo}
                  className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </Player>
    )
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        {renderMedia()}
      </div>

      {videoData && (
        <div className="mt-4 rounded-lg bg-purple-800 p-4">
          <h1 className="text-2xl font-semibold">{videoData?.title}</h1>
          <p className="mt-2 text-gray-300">{videoData?.description}</p>
        </div>
      )}
    </div>
  )
}

export default VideoDetails