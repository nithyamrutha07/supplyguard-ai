# Identify downstream factories, orders and inventory affected.

"""Identify factories and customer orders affected by disruptions."""

from typing import Any


def analyze_impact(
    scenario: dict[str, Any],
    disruption_result: dict[str, Any],
) -> dict[str, Any]:
    """Match disrupted materials and suppliers to factories and orders."""

    disrupted_materials = {
        item.get("material_id")
        for item in disruption_result.get("disruptions", [])
        if item.get("type") == "low_inventory"
    }

    disrupted_suppliers = {
        item.get("supplier")
        for item in disruption_result.get("disruptions", [])
        if item.get("type") == "supplier_failure"
    }

    delayed_shipments = {
        item.get("shipment_id")
        for item in disruption_result.get("disruptions", [])
        if item.get("type") == "shipment_delay"
    }

    affected_factories = []
    affected_orders = []

    for factory in scenario.get("factories", []):
        materials = set(factory.get("required_materials", []))

        if materials & disrupted_materials:
            affected_factories.append({
                "factory_id": factory.get("factory_id", "unknown"),
                "reason": "Requires material with low inventory.",
                "affected_materials": sorted(materials & disrupted_materials),
            })

    for order in scenario.get("orders", []):
        order_materials = set(order.get("required_materials", []))
        supplier = order.get("supplier")
        shipment_id = order.get("shipment_id")

        reasons = []

        matching_materials = order_materials & disrupted_materials
        if matching_materials:
            reasons.append("Low inventory: " + ", ".join(sorted(matching_materials)))

        if supplier in disrupted_suppliers:
            reasons.append(f"Supplier failure: {supplier}")

        if shipment_id in delayed_shipments:
            reasons.append(f"Shipment delayed: {shipment_id}")

        if reasons:
            affected_orders.append({
                "order_id": order.get("order_id", "unknown"),
                "customer": order.get("customer", "unknown"),
                "reasons": reasons,
                "estimated_value": order.get("order_value", 0),
            })

    total_exposed_value = sum(
        order["estimated_value"] for order in affected_orders
    )

    return {
        "affected_factory_count": len(affected_factories),
        "affected_order_count": len(affected_orders),
        "affected_factories": affected_factories,
        "affected_orders": affected_orders,
        "total_exposed_order_value": total_exposed_value,
        "currency": scenario.get("currency", "USD"),
    }
