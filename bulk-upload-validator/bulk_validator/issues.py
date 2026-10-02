from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Issue:
    row: int  # spreadsheet row number (header = 1); 0 for file-level issues
    column: str  # "" for row- or file-level issues
    code: str
    severity: str  # "FATAL" (file unusable) | "ERROR" (row rejected) | "WARNING" (row accepted, review)
    message: str
    value: str = ""

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


def fatal(code: str, message: str) -> Issue:
    return Issue(0, "", code, "FATAL", message)


def error(row: int, column: str, code: str, message: str, value: str = "") -> Issue:
    return Issue(row, column, code, "ERROR", message, value)


def warning(row: int, column: str, code: str, message: str, value: str = "") -> Issue:
    return Issue(row, column, code, "WARNING", message, value)
