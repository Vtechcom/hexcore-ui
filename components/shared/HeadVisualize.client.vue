<script lang="ts" setup>
  import type { HydraHead } from '~/interfaces/api/hydra-nodes/hydra-heads.type'
  import cytoscape from 'cytoscape'

  const props = defineProps<{
    head: HydraHead
  }>()

  const cyContainer = ref<HTMLDivElement | null>(null)
  const cy = ref<cytoscape.Core | null>(null)

  function renderNodes() {
    if (!cyContainer.value) return

    const hydraNodeElements: cytoscape.ElementDefinition[] = []
    props.head.hydraNodes.forEach((node, index) => {
      // connect to other nodes
      const nextNodeIdx = index + 1 === props.head.hydraNodes.length ? 0 : index + 1
      hydraNodeElements.push(
        { data: { id: String(node.id), label: `#${node.id}` } },
        {
          data: { id: `l${index + 1}`, source: String(node.id), target: 'layer1' },
          classes: 'dashed'
        }
      )
      if (props.head.hydraNodes.length > 1) {
        hydraNodeElements.push({
          data: {
            id: `e${index + 1}`,
            source: String(node.id),
            target: String(props.head.hydraNodes[nextNodeIdx].id)
          }
        })
      }
    })

    cy.value = cytoscape({
      container: cyContainer.value,
      minZoom: 0.7,
      maxZoom: 1,

      elements: [
        // L1 and Ogmios - fixed position
        {
          data: { id: 'layer1', label: 'L1' },
          position: { x: 10, y: 0 },
          // locked: true,
          classes: 'ogmios'
        },
        {
          data: { id: 'ogmios1', label: 'Ogmios' },
          position: { x: 10, y: 80 },
          // locked: true,
          classes: 'ogmios'
        },

        // edges
        { data: { id: 'ogmios1-l1', source: 'layer1', target: 'ogmios1' } },

        ...hydraNodeElements
      ],

      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#382adc',
            label: 'data(label)',
            color: '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            width: 48,
            height: 48,
            'border-color': '#382adc',
            'border-width': '1px',
            'border-style': 'solid'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'curve-style': 'bezier'
          }
        },
        {
          selector: '.ogmios',
          style: {
            shape: 'rectangle',
            'background-color': '#827ef0'
          }
        },
        {
          selector: '.dashed',
          style: {
            'line-style': 'dashed',
            'line-color': '#81a9ff'
          }
        }
      ],

      layout: {
        name: 'cose',
        padding: 20,
        // Exclude locked nodes from layout
        stop: function () {
          cy.value?.fit()
        }
      }
    })

    // optional: auto resize on window resize
    window.addEventListener('resize', () => {
      cy.value?.resize()
      cy.value?.fit()
    })

    cy.value?.on('tap', 'node', evt => {
      const node = evt.target.data()
      console.log('Clicked node:', node)
    })
  }

  onMounted(() => {
    nextTick(() => {
      renderNodes()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      // cleanup
    })
    cy.value?.destroy()
  })
</script>

<template>
  <div class="relative">
    <div class="absolute left-1 top-1 z-10 flex items-center justify-center">
      <el-button class="!h-7" size="small" plain>
        <icon name="ic:round-layers" class="text-gray-4 size-6" />
      </el-button>
    </div>
    <div ref="cyContainer" class="bg-gray-1 h-60 w-full rounded p-1"></div>
  </div>
</template>

<style lang="scss" scoped></style>
