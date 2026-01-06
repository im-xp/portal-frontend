'use client'

import useGetData from "./hooks/useGetData"
import AttendeeGrid from "./components/AttendeeGrid"
import Permissions from "@/components/Permissions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "../../../../components/ui/switch"
import { useEffect, useState } from "react"
import useExportCsv from "./hooks/useExportCsv"
import { FileDown, Loader2, ListFilter, Search } from "lucide-react"

const Page = () => {
  const { 
    attendees, 
    loading, 
    totalAttendees, 
    currentPage, 
    pageSize, 
    handlePageChange, 
    handlePageSizeChange,
    // filters
    searchQuery,
    setSearchQuery,
    bringsKids,
    setBringsKids,
    selectedWeeks,
    handleToggleWeek,
    applyFilters,
    clearFilters,
  } = useGetData(12) // Default to 12 for better grid layout
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { isExporting, handleExportCsv } = useExportCsv()

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      applyFilters()
    }
  }

  // Debounce search query: auto-apply after 300ms of inactivity
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters()
    }, 300)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  return (
    <TooltipProvider>
      <Permissions>
        <div className="flex flex-col h-full max-w-6xl mx-auto p-6">
        <div className="flex-none">
          <h1 className="text-2xl font-semibold tracking-tight">Participant Directory</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Get to know your fellow participants—reach out to connect, plan activities, or find collaborators.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Only showing participants who opted in to share their details.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              aria-label="Search in directory"
              placeholder="Search by name, organization, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="bg-card pl-10"
            />
          </div>
          {(searchQuery.trim() !== '' || bringsKids !== null || selectedWeeks.length > 0) && (
            <Button
              variant="ghost"
              aria-label="Clear filters"
              onClick={clearFilters}
              className="bg-red-500 text-white hover:bg-red-500 hover:shadow-md hover:text-white"
            >
              Clear filters
            </Button>
          )}
          <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button
                    aria-label="Open filters"
                    className="bg-white text-black hover:bg-white hover:shadow-md"
                  >
                    <ListFilter className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open search filters</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Brings kids</span>
                    <span className="text-xs text-muted-foreground">Toggle to filter by bringing kids</span>
                  </div>
                  <Switch
                    checked={bringsKids ?? false}
                    onCheckedChange={(v: boolean) => setBringsKids(v)}
                    aria-label="Toggle brings kids filter"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Weeks Coming</span>
                  <div className="flex flex-wrap gap-2">
                    {[1,2,3,4].map((week) => {
                      const isActive = selectedWeeks.includes(week)
                      return (
                        <Button
                          key={week}
                          variant={isActive ? 'default' : 'outline'}
                          className={isActive ? 'bg-primary text-white' : 'bg-white text-black'}
                          aria-pressed={isActive}
                          onClick={() => handleToggleWeek(week)}
                        >
                          Week {week}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-between gap-2">
                  <Button variant="ghost" onClick={() => { clearFilters(); setFiltersOpen(false) }}>
                    Clear
                  </Button>
                  <Button onClick={() => { applyFilters(); setFiltersOpen(false) }}>
                    Apply filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Export attendees as CSV"
                className="bg-white text-black hover:bg-white hover:shadow-md"
                onClick={handleExportCsv}
                disabled={isExporting}
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export attendees as CSV</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <AttendeeGrid 
          attendees={attendees} 
          loading={loading}
          totalAttendees={totalAttendees}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
        </div>
      </Permissions>
    </TooltipProvider>
  )
}

export default Page