<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import {
		GripVertical,
		Plus,
		Trash2,
		Save,
		RotateCcw,
		Check,
		X,
		Edit2,
		FolderGit2
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Local state for editing
	let groups = $state(structuredClone(data.groups));
	let projects = $state(structuredClone(data.projects));
	let hasChanges = $state(false);
	let isSaving = $state(false);

	// New group form
	let newGroupName = $state('');
	let newGroupColor = $state('#6b7280');
	let showNewGroupForm = $state(false);

	// Editing project name
	let editingProjectId = $state<string | null>(null);
	let editingProjectName = $state('');

	// Drag state
	let draggedProject = $state<string | null>(null);
	let dragOverGroup = $state<string | null>(null);

	// Track changes
	$effect(() => {
		const currentConfig = JSON.stringify({ groups, projects });
		const originalConfig = JSON.stringify({ groups: data.groups, projects: data.projects });
		hasChanges = currentConfig !== originalConfig;
	});

	// Get projects for a group, sorted by order
	function getProjectsInGroup(groupId: string) {
		return projects
			.filter(p => p.groups.includes(groupId))
			.sort((a, b) => a.order - b.order);
	}

	// Handle drag start
	function handleDragStart(event: DragEvent, projectId: string) {
		draggedProject = projectId;
		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', projectId);
		}
	}

	// Handle drag over
	function handleDragOver(event: DragEvent, groupId: string) {
		event.preventDefault();
		dragOverGroup = groupId;
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}

	// Handle drag leave
	function handleDragLeave() {
		dragOverGroup = null;
	}

	// Handle drop
	function handleDrop(event: DragEvent, targetGroupId: string) {
		event.preventDefault();
		dragOverGroup = null;

		if (!draggedProject) return;

		const projectIndex = projects.findIndex(p => p.id === draggedProject);
		if (projectIndex === -1) return;

		const project = projects[projectIndex];

		// Add to group if not already in it
		if (!project.groups.includes(targetGroupId)) {
			projects[projectIndex] = {
				...project,
				groups: [...project.groups, targetGroupId]
			};
		}

		draggedProject = null;
	}

	// Handle drag end
	function handleDragEnd() {
		draggedProject = null;
		dragOverGroup = null;
	}

	// Remove project from group
	function removeFromGroup(projectId: string, groupId: string) {
		const projectIndex = projects.findIndex(p => p.id === projectId);
		if (projectIndex === -1) return;

		const project = projects[projectIndex];
		projects[projectIndex] = {
			...project,
			groups: project.groups.filter(g => g !== groupId)
		};
	}

	// Start editing project name
	function startEditingProject(projectId: string, currentName: string) {
		editingProjectId = projectId;
		editingProjectName = currentName;
	}

	// Save project name
	function saveProjectName(projectId: string) {
		const projectIndex = projects.findIndex(p => p.id === projectId);
		if (projectIndex !== -1 && editingProjectName.trim()) {
			projects[projectIndex] = {
				...projects[projectIndex],
				displayName: editingProjectName.trim()
			};
		}
		editingProjectId = null;
		editingProjectName = '';
	}

	// Cancel editing
	function cancelEditing() {
		editingProjectId = null;
		editingProjectName = '';
	}

	// Reorder within group (move up/down)
	function moveProject(projectId: string, groupId: string, direction: 'up' | 'down') {
		const groupProjects = getProjectsInGroup(groupId);
		const currentIndex = groupProjects.findIndex(p => p.id === projectId);

		if (currentIndex === -1) return;
		if (direction === 'up' && currentIndex === 0) return;
		if (direction === 'down' && currentIndex === groupProjects.length - 1) return;

		const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
		const currentOrder = groupProjects[currentIndex].order;
		const targetOrder = groupProjects[targetIndex].order;

		// Swap orders
		const currentProjectIndex = projects.findIndex(p => p.id === groupProjects[currentIndex].id);
		const targetProjectIndex = projects.findIndex(p => p.id === groupProjects[targetIndex].id);

		if (currentProjectIndex !== -1 && targetProjectIndex !== -1) {
			projects[currentProjectIndex] = { ...projects[currentProjectIndex], order: targetOrder };
			projects[targetProjectIndex] = { ...projects[targetProjectIndex], order: currentOrder };
		}
	}

	// Get config JSON for saving
	function getConfigJson() {
		return JSON.stringify({ groups, projects });
	}
</script>

<div class="p-6 space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl font-semibold text-white">Projects & Groups</h2>
			<p class="text-gray-400 text-sm mt-1">Organize repos into groups. Drag to move between groups.</p>
		</div>
		<div class="flex items-center gap-2">
			{#if hasChanges}
				<form method="POST" action="?/saveConfig" use:enhance={() => {
					isSaving = true;
					return async ({ update }) => {
						await update();
						isSaving = false;
					};
				}}>
					<input type="hidden" name="config" value={getConfigJson()} />
					<button
						type="submit"
						disabled={isSaving}
						class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 rounded-lg text-white transition-colors"
					>
						<Save class="w-4 h-4" />
						{isSaving ? 'Saving...' : 'Save Changes'}
					</button>
				</form>
			{/if}
			<form method="POST" action="?/resetConfig" use:enhance>
				<button
					type="submit"
					class="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
					title="Reset to defaults"
				>
					<RotateCcw class="w-4 h-4" />
				</button>
			</form>
		</div>
	</div>

	<!-- Messages -->
	{#if form?.success}
		<div class="p-3 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-2 text-green-300 text-sm">
			<Check class="w-4 h-4" />
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-2 text-red-300 text-sm">
			<X class="w-4 h-4" />
			{form.error}
		</div>
	{/if}

	<!-- Add New Group -->
	<div class="flex items-center gap-2">
		{#if showNewGroupForm}
			<form method="POST" action="?/addGroup" use:enhance={() => {
				return async ({ update }) => {
					await update();
					newGroupName = '';
					showNewGroupForm = false;
				};
			}} class="flex items-center gap-2">
				<input
					type="text"
					name="name"
					bind:value={newGroupName}
					placeholder="Group name..."
					class="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
				/>
				<input
					type="color"
					name="color"
					bind:value={newGroupColor}
					class="w-8 h-8 rounded cursor-pointer"
				/>
				<button type="submit" class="p-1.5 bg-green-600 hover:bg-green-700 rounded text-white">
					<Check class="w-4 h-4" />
				</button>
				<button type="button" onclick={() => showNewGroupForm = false} class="p-1.5 bg-gray-600 hover:bg-gray-500 rounded text-white">
					<X class="w-4 h-4" />
				</button>
			</form>
		{:else}
			<button
				onclick={() => showNewGroupForm = true}
				class="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-sm transition-colors"
			>
				<Plus class="w-4 h-4" />
				Add Group
			</button>
		{/if}
	</div>

	<!-- Groups Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each groups as group}
			{@const groupProjects = getProjectsInGroup(group.id)}
			<div
				class="bg-gray-800 rounded-lg overflow-hidden transition-all {dragOverGroup === group.id ? 'ring-2 ring-blue-500' : ''}"
				ondragover={(e) => handleDragOver(e, group.id)}
				ondragleave={handleDragLeave}
				ondrop={(e) => handleDrop(e, group.id)}
				role="region"
				aria-label="Drop zone for {group.name}"
			>
				<!-- Group Header -->
				<div class="px-4 py-3 border-b border-gray-700 flex items-center justify-between" style="border-left: 3px solid {group.color}">
					<div class="flex items-center gap-2">
						<span class="font-medium text-white">{group.name}</span>
						<span class="text-xs text-gray-500">({groupProjects.length})</span>
					</div>
					{#if group.id !== 'jaslr' && group.id !== 'jvp-ux'}
						<form method="POST" action="?/deleteGroup">
							<input type="hidden" name="groupId" value={group.id} />
							<button type="submit" class="p-1 text-gray-500 hover:text-red-400 transition-colors" title="Delete group">
								<Trash2 class="w-3.5 h-3.5" />
							</button>
						</form>
					{/if}
				</div>

				<!-- Projects List -->
				<div class="p-2 min-h-[100px] space-y-1">
					{#each groupProjects as project (project.id)}
						<div
							class="group flex items-center gap-2 px-2 py-1.5 bg-gray-700/50 hover:bg-gray-700 rounded cursor-move transition-colors {draggedProject === project.id ? 'opacity-50' : ''}"
							draggable="true"
							ondragstart={(e) => handleDragStart(e, project.id)}
							ondragend={handleDragEnd}
							role="listitem"
						>
							<GripVertical class="w-4 h-4 text-gray-500 shrink-0" />

							{#if editingProjectId === project.id}
								<input
									type="text"
									bind:value={editingProjectName}
									onkeydown={(e) => {
										if (e.key === 'Enter') saveProjectName(project.id);
										if (e.key === 'Escape') cancelEditing();
									}}
									class="flex-1 px-2 py-0.5 bg-gray-800 border border-gray-600 rounded text-sm text-white focus:outline-none focus:border-blue-500"
								/>
								<button onclick={() => saveProjectName(project.id)} class="p-1 text-green-400 hover:text-green-300">
									<Check class="w-3.5 h-3.5" />
								</button>
								<button onclick={cancelEditing} class="p-1 text-gray-400 hover:text-gray-300">
									<X class="w-3.5 h-3.5" />
								</button>
							{:else}
								<div class="flex-1 min-w-0">
									<div class="text-sm text-white truncate">{project.displayName}</div>
									<div class="text-xs text-gray-500 truncate">{project.owner}/{project.repo}</div>
								</div>
								<button
									onclick={() => startEditingProject(project.id, project.displayName)}
									class="p-1 text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
									title="Rename"
								>
									<Edit2 class="w-3.5 h-3.5" />
								</button>
								{#if project.groups.length > 1}
									<button
										onclick={() => removeFromGroup(project.id, group.id)}
										class="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
										title="Remove from this group"
									>
										<X class="w-3.5 h-3.5" />
									</button>
								{/if}
							{/if}
						</div>
					{:else}
						<div class="flex items-center justify-center h-20 text-gray-500 text-sm">
							<FolderGit2 class="w-5 h-5 mr-2 opacity-50" />
							Drag repos here
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<!-- All Projects (for reference) -->
	<div class="mt-8">
		<h3 class="text-lg font-medium text-gray-300 mb-3">All Projects</h3>
		<div class="bg-gray-800 rounded-lg p-4">
			<div class="flex flex-wrap gap-2">
				{#each projects as project}
					<div
						class="flex items-center gap-1.5 px-2 py-1 bg-gray-700 rounded text-sm cursor-move"
						draggable="true"
						ondragstart={(e) => handleDragStart(e, project.id)}
						ondragend={handleDragEnd}
						role="listitem"
					>
						<span class="text-gray-300">{project.displayName}</span>
						<span class="text-xs text-gray-500">({project.groups.length})</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
