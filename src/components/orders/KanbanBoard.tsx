
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'
import { useUpdateOrder } from '@/lib/hooks/useOrders'
import KanbanColumn from '@/components/orders/KanbanColumn'
import { cn } from '@/lib/utils'

interface KanbanBoardProps {
  orders: any[]
  stages: any[]
  statuses: any[]
}

export default function KanbanBoard({ orders, stages, statuses }: KanbanBoardProps) {
  const [localOrders, setLocalOrders] = useState(orders)
  const updateOrder = useUpdateOrder()

  useEffect(() => {
    setLocalOrders(orders)
  }, [orders])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    const activeOrder = localOrders.find((o) => o.id === activeId)
    const overStage = stages.find((s) => s.id === overId)

    if (activeOrder && overStage) {
      updateOrder.mutate({
        id: activeOrder.id,
        stage_id: overStage.id,
      })

      const newOrders = localOrders.map((o) =>
        o.id === activeOrder.id
          ? { ...o, stage_id: overStage.id }
          : o
      )
      setLocalOrders(newOrders)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn(
          'w-full min-w-0 max-w-full',
          'md:overflow-x-auto md:overscroll-x-contain',
        )}
      >
        <div
          className={cn(
            'flex w-full min-w-0 flex-col gap-4',
            'md:w-max md:flex-row md:gap-6 md:pb-2 md:snap-x md:snap-mandatory',
          )}
        >
          {stages.map((stage) => {
            const stageOrders = localOrders.filter(
              (o) => o.stage_id === stage.id
            )

            return (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                orders={stageOrders}
                statuses={statuses}
              />
            )
          })}
        </div>
      </div>
    </DndContext>
  )
}
