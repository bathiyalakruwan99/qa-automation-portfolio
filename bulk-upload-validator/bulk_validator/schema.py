"""Fictional "shipment upload v1" schema, invented for this portfolio.

The schema is data, not code: validators are generic and read these definitions, so adding a column or a rule
does not mean writing a new validator.
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Column:
    name: str
    kind: str  # "text" | "number" | "date" | "email" | "enum"
    required: bool = False
    unique: bool = False
    pattern: str | None = None
    allowed: tuple[str, ...] = ()
    minimum: float | None = None
    maximum: float | None = None
    # Name of a reference list the value must exist in (loaded from the reference directory).
    reference: str | None = None
    description: str = ""


@dataclass(frozen=True)
class Schema:
    name: str
    columns: tuple[Column, ...]
    cross_field_rules: tuple[str, ...] = field(default_factory=tuple)

    def column(self, name: str) -> Column | None:
        return next((c for c in self.columns if c.name == name), None)

    @property
    def names(self) -> list[str]:
        return [c.name for c in self.columns]


SHIPMENT_UPLOAD_V1 = Schema(
    name="shipment-upload-v1",
    columns=(
        Column(
            "shipment_ref",
            "text",
            required=True,
            unique=True,
            pattern=r"^SHP-\d{4,8}$",
            description="Unique shipment reference, e.g. SHP-10001",
        ),
        Column("customer_code", "text", required=True, reference="customers"),
        Column("origin_code", "text", required=True, reference="locations"),
        Column("destination_code", "text", required=True, reference="locations"),
        Column("vehicle_type", "enum", required=True, allowed=("TRUCK", "VAN", "REEFER")),
        Column("weight_kg", "number", required=True, minimum=0.001, maximum=30000),
        Column("pickup_date", "date", required=True),
        Column("delivery_date", "date", required=True),
        Column("dest_lat", "number", minimum=-90, maximum=90),
        Column("dest_lng", "number", minimum=-180, maximum=180),
        Column("temperature_c", "number", minimum=-25, maximum=8, description="Required for REEFER shipments only"),
        Column("contact_email", "email"),
    ),
    cross_field_rules=(
        "origin_differs_from_destination",
        "delivery_not_before_pickup",
        "coordinates_both_or_neither",
        "reefer_needs_temperature",
        "temperature_only_for_reefer",
    ),
)
