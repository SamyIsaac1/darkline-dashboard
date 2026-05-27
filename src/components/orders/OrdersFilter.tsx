
import { useUIStore } from '@/lib/store/uiStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Search } from 'lucide-react'

interface OrdersFilterProps {
  statuses: any[]
  stages: any[]
  tags: any[]
}

export default function OrdersFilter({ statuses, stages, tags }: OrdersFilterProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedStage,
    setSelectedStage,
    selectedTags,
    addSelectedTag,
    removeSelectedTag,
    resetFilters,
  } = useUIStore()

  const hasFilters =
    selectedStatus || selectedStage || selectedTags.length > 0 || searchQuery

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search orders by number, customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.id}
            onClick={() =>
              setSelectedStatus(
                selectedStatus === status.id ? null : status.id
              )
            }
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === status.id
                ? 'bg-foreground text-background'
                : 'bg-muted text-foreground hover:bg-muted-foreground/20'
            }`}
          >
            {status.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() =>
              setSelectedStage(selectedStage === stage.id ? null : stage.id)
            }
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedStage === stage.id
                ? 'bg-foreground text-background'
                : 'bg-muted text-foreground hover:bg-muted-foreground/20'
            }`}
          >
            {stage.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() =>
              selectedTags.includes(tag.id)
                ? removeSelectedTag(tag.id)
                : addSelectedTag(tag.id)
            }
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              selectedTags.includes(tag.id)
                ? 'bg-foreground text-background'
                : 'bg-muted text-foreground hover:bg-muted-foreground/20'
            }`}
          >
            {tag.name}
            {selectedTags.includes(tag.id) && (
              <X className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-full sm:w-auto"
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}
