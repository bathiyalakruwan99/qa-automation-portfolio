"""Rules that need more than one cell. Each rule declares the columns it reads (see RULES)."""

from __future__ import annotations

from collections.abc import Callable

from ..issues import Issue, error, warning
from .formats import parse_date, parse_number

Rule = Callable[[int, dict[str, str]], list[Issue]]


def origin_differs_from_destination(row: int, r: dict[str, str]) -> list[Issue]:
    if r.get("origin_code") and r.get("origin_code") == r.get("destination_code"):
        return [error(row, "destination_code", "SAME_ORIGIN_DESTINATION", "origin and destination must differ")]
    return []


def delivery_not_before_pickup(row: int, r: dict[str, str]) -> list[Issue]:
    pickup, delivery = parse_date(r.get("pickup_date", "")), parse_date(r.get("delivery_date", ""))
    if pickup and delivery and delivery < pickup:
        return [
            error(
                row,
                "delivery_date",
                "DELIVERY_BEFORE_PICKUP",
                f"delivery_date {delivery} is before pickup_date {pickup}",
                r["delivery_date"],
            )
        ]
    return []


def coordinates_both_or_neither(row: int, r: dict[str, str]) -> list[Issue]:
    if bool(r.get("dest_lat")) != bool(r.get("dest_lng")):
        missing = "dest_lng" if r.get("dest_lat") else "dest_lat"
        return [error(row, missing, "COORDINATE_PAIR_INCOMPLETE", "dest_lat and dest_lng must be given together")]
    return []


def reefer_needs_temperature(row: int, r: dict[str, str]) -> list[Issue]:
    if r.get("vehicle_type") == "REEFER" and r.get("temperature_c", "") == "":
        return [error(row, "temperature_c", "REEFER_TEMPERATURE_MISSING", "REEFER shipments need temperature_c")]
    return []


def temperature_only_for_reefer(row: int, r: dict[str, str]) -> list[Issue]:
    if r.get("vehicle_type") in ("TRUCK", "VAN") and parse_number(r.get("temperature_c", "")) is not None:
        return [
            warning(
                row,
                "temperature_c",
                "TEMPERATURE_NOT_APPLICABLE",
                f"temperature_c is ignored for {r['vehicle_type']} shipments",
                r["temperature_c"],
            )
        ]
    return []


# rule name -> (columns the rule reads, rule). A rule is skipped when any of its columns already failed a
# single-cell check, so one bad value produces one finding instead of a cascade of follow-on errors.
RULES: dict[str, tuple[tuple[str, ...], Rule]] = {
    "origin_differs_from_destination": (("origin_code", "destination_code"), origin_differs_from_destination),
    "delivery_not_before_pickup": (("pickup_date", "delivery_date"), delivery_not_before_pickup),
    "coordinates_both_or_neither": (("dest_lat", "dest_lng"), coordinates_both_or_neither),
    "reefer_needs_temperature": (("vehicle_type", "temperature_c"), reefer_needs_temperature),
    "temperature_only_for_reefer": (("vehicle_type", "temperature_c"), temperature_only_for_reefer),
}
