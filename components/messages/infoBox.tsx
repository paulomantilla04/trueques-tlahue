import Image from "next/image"

interface InfoBoxProps {
  image: string
  title: string
  condition: string
  header?: string
  imageCliente: string
  nombreCliente: string
  estadoCliente: string
  headerCliente: string

}

  
export function InfoBox({ image, title, condition, header = "Producto", imageCliente,
    nombreCliente, estadoCliente, 
 }: InfoBoxProps) {
  return (
    <div className="flex-1 bg-orange-300 rounded-2xl p-4 space-y-4">
      <h3 className="font-semibold text-foreground mb-3">{header}</h3>

      <div className="bg-white rounded-xl p-3">
        <div className="relative w-full h-32 bg-[#e8ecd8] rounded-lg mb-3 overflow-hidden">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <h4 className="font-medium text-foreground text-sm line-clamp-1">
          {title}
        </h4>

        <p className="text-xs text-muted-foreground mt-1 capitalize">
          Estado: {condition.replace('_', ' ')}
        </p>
      </div>
      

      
      <div className="bg-white rounded-xl p-3 ">
        <div className="relative w-full h-32  bg-[#e8ecd8] rounded-lg mb-3 overflow-hidden">
          <Image 
            src={imageCliente} 
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <h4 className="font-medium text-foreground text-sm line-clamp-1">
          {nombreCliente}
        </h4>

        <p className="text-xs text-muted-foreground mt-1 capitalize">
          Estado: {estadoCliente.replace('_', ' ')}
        </p>
      </div>
    </div>
  )
}