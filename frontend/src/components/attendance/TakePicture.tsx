import { useInternContext } from "../../context/InternContext"
import Camera from "../Camera"

const TakePicture = () => {
  const { photo } = useInternContext();

  return (
    <div className="flex w-full gap-4 px-4 py-6 bg-gray-300">
      {/* Camera */}
      <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {/* camera 1 */}
        <div className="flex aspect-video items-center justify-center">
          <Camera />
        </div>
      </div>

      {/* Picture Result */}
      <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        {/* picture result */}
        <div className="flex aspect-video items-center justify-center">
          {photo ? (
            <img
              src={photo.url}
              alt="Captured"
              className="w-full max-w-md rounded-lg"
            />
          ) : <span className="text-sm text-gray-400">
                Picture Result
              </span>}
        </div>
      </div>
    </div>
  )
}

export default TakePicture
