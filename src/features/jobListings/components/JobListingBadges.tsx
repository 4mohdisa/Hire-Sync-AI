import { Badge } from "@/components/ui/badge"
import { JobListingTable } from "@/drizzle/schema"
import { cn } from "@/lib/utils"
import { ComponentProps } from "react"
import {
  formatExperienceLevel,
  formatJobListingLocation,
  formatJobType,
  formatLocationRequirement,
  formatWage,
} from "../lib/formatters"
import {
  BanknoteIcon,
  BuildingIcon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
} from "lucide-react"

export function JobListingBadges({
  jobListing: {
    wage,
    wage_interval,
    state_abbreviation,
    city,
    type,
    experience_level,
    location_requirement,
    is_featured,
  },
  className,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wage_interval"
    | "state_abbreviation"
    | "city"
    | "type"
    | "experience_level"
    | "location_requirement"
    | "is_featured"
  >
  className?: string
}) {
  const badgeProps = {
    variant: "outline",
    className,
  } satisfies ComponentProps<typeof Badge>

  return (
    <>
      {is_featured && (
        <Badge
          {...badgeProps}
          className={cn(
            className,
            "border-featured bg-featured/50 text-featured-foreground"
          )}
        >
          Featured
        </Badge>
      )}
      {wage != null && wage_interval != null && (
        <Badge {...badgeProps}>
          <BanknoteIcon />
          {formatWage(wage, wage_interval)}
        </Badge>
      )}
      {(state_abbreviation != null || city != null) && (
        <Badge {...badgeProps}>
          <MapPinIcon className="size-10" />
          {formatJobListingLocation({ stateAbbreviation: state_abbreviation, city })}
        </Badge>
      )}
      <Badge {...badgeProps}>
        <BuildingIcon />
        {formatLocationRequirement(location_requirement)}
      </Badge>
      <Badge {...badgeProps}>
        <HourglassIcon />
        {formatJobType(type)}
      </Badge>
      <Badge {...badgeProps}>
        <GraduationCapIcon />
        {formatExperienceLevel(experience_level)}
      </Badge>
    </>
  )
}
